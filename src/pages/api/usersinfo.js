import db from '../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await db.query('SELECT id, "Username", email, adress, phone, city, country, zipcode, gender FROM "Users"');
      console.log(`Retrieved ${result.rows.length} "Users" from database`);
      console.log('Fetched data:', result.rows);

      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { Username, email, adress, phone, city, country, zipcode, gender, currentPassword, newPassword } = req.body;

    if (currentPassword && newPassword) {
      try {
        const result = await db.query('SELECT "Password" FROM "Users" WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        console.log('Current password:', currentPassword);
        console.log('Stored password hash:', user.Password);

        const isMatch = await bcrypt.compare(currentPassword, user.Password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
          return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE "Users" SET "Password" = $1 WHERE email = $2', [hashedPassword, email]);

        return res.status(200).json({ message: 'Password changed successfully' });
      } catch (error) {
        console.error('Password change error:', error);
        return res.status(500).json({ message: 'Internal server error', details: error.message });
      }
    }

    // Allow partial updates
    const fieldsToUpdate = {};
    if (Username) fieldsToUpdate.Username = Username;
    if (email) fieldsToUpdate.email = email;
    if (adress) fieldsToUpdate.adress = adress;
    if (phone) fieldsToUpdate.phone = phone;
    if (city) fieldsToUpdate.city = city;
    if (country) fieldsToUpdate.country = country;
    if (zipcode) fieldsToUpdate.zipcode = zipcode;
    if (gender) fieldsToUpdate.gender = gender;

    const setClause = Object.keys(fieldsToUpdate).map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = Object.values(fieldsToUpdate);

    if (values.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    try {
      const result = await db.query(
        `UPDATE "Users" SET ${setClause} WHERE email = $${values.length + 1} RETURNING id, "Username", email, adress, phone, city, country, zipcode, gender`,
        [...values, email]
      );

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ message: 'Internal server error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}