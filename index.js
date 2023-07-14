const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL  = require('./models/url');
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://0.0.0.0:27017/short-url")
.then(() => console.log("Mongodb connected...")
);

app.use(express.json());

app.use("/url",urlRoute);

app.get('/:shortId', async (req,res)=> {
      const shortId = req.params.shortId;
      const entry = await URL.findOneAndUpdate(
      {
         shortId,
      }, 
      {
         $push: {
            visitHistory:  {
            timestamp: Date.now(),
         },
       },
     }
   );
   if (entry && entry.redirectURL) {
      res.redirect(entry.redirectURL);
    } else {
      // Handle the case when 'entry' is null or 'redirectURL' is not available
      // You can choose to redirect to a default URL or show an error message.
      res.redirect('/default-url');
    }    
});

app.listen(8001, () => console.log('server started at PORT: 8001'));
