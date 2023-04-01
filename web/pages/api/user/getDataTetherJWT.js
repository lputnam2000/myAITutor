import { getServerSession } from 'next-auth/next';
import jwt from 'jsonwebtoken';
import { authOptions } from 'pages/api/auth/[...nextauth]';

/**
 * Handles GET requests to generate a JWT for a logged-in user.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 */
export default async function handler(req, res) {
  // Handle only GET requests
  if (req.method == 'GET') {
    try {
      // Retrieve the user's session data
      const session = await getServerSession(req, res, authOptions);
      // If there is no session data, return an unauthorized error
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // Generate a JWT containing the user's ID as the "sub" claim
      const token = jwt.sign({ sub: session.user.id }, process.env.JWT_SECRET_KEY);
      // Send the JWT as a JSON response
      res.status(200).json({ token });
    } catch (error) {
      // Handle any errors that occur during the request
      res.status(500).json({ error: error.message });
    }
  } else {
    // Handle any non-GET requests with a "405 Method Not Allowed" error
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}