import type { NextApiRequest, NextApiResponse } from "next";
import middleware from '../../../middleware/middleware'
import { createRouter } from "next-connect";
import agilityMgmt from '@agility/content-management'
import fs from 'fs'
import sizeOf from 'image-size'
import { getNewFileName } from '../../../utils/imageUtils';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(middleware);

router.post(async(req: any, res: any) => {
  
    //set up Agility CMS Management client
    // TD: Use new mgmt api
    const api = agilityMgmt.getApi({
        location: req.body.location[0],
        websiteName: req.body.websiteName[0],
        securityKey: req.body.securityKey[0]
    });
    
    //parse the image from the request
    const image = req.files.image[0];
    console.log(`Image from Request`, image);
    
    //get the dimensions of the image
    const size = sizeOf(image.path);
    console.log(`Image dimensions`, size);

    //get the contents of the image
    let fileContent = fs.createReadStream(image.path)
    
    //build a unique filename with a timestamp
    const fileName = getNewFileName(image.originalFilename);

    
    //upload the file to Agility CMS
    const uploadRes = await api.uploadMedia({
      fileName,
      fileContent,
      mediaFolder: req.body.assetFolder ? req.body.assetFolder[0] : ''
    });

    console.log(`Image upload Response`, uploadRes);

    //return the uploaded file details
    res.status(200).json({ 
        success: 1,
        file: {
            url: uploadRes.url,
            size,
        }
    });

});


export const config = {
  api: {
    bodyParser: false,
  },
}

export default router;