import axios from "axios";

export default async function handler(req, res) {
  const { input } = req.query;
  if (req.method === 'GET') {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`);
      console.log(response)

      const rjson = await response.json()
      console.log(rjson)
      res.status(200).json(response)
    }
    catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message })

    }
  }
}
