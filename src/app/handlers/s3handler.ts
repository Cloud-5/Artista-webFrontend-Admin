import AWS from "aws-sdk";
import { Request, Response, NextFunction } from 'express';


const s3 = new AWS.S3(
  {
    accessKeyId: 'AKIA3FLDZ3RWSJRJ5UNX',
    secretAccessKey: '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',
    //region: 'ap-south-1'
  }
);

// Function to upload a file to S3
// export async function uploadFileToS3(file: File): Promise<string> {
//   const contentType = file.type;
//   const bucketName = 'test-artista'
  
//   const params = {
//     Bucket: bucketName,
//     Key: file.name,
//     Body: file,
//     ContentType: contentType
//   };

//   return new Promise((resolve, reject) => {
//     bucket.upload(params, (err: any, data: { Location: string | PromiseLike<string>; }) => {
//       if (err) {
//         console.log('There was an error uploading your file: ', err);
//         reject(err);
//       } else {
//         console.log('Successfully uploaded file.', data);
//         resolve(data.Location); // returning the url
//       }
//     });
//   });

//   //for upload progress   
//   /*bucket.upload(params).on('httpUploadProgress', function (evt) {
//             console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
//         }).send(function (err, data) {
//             if (err) {
//                 console.log('There was an error uploading your file: ', err);
//                 return false;
//             }
//             console.log('Successfully uploaded file.', data);
//             return true;
//         });*/
// }



export const uploadFileToS3 = async function (req: Request, res: Response, next: NextFunction) {
    try {
        if (req.hasOwnProperty('fileValidationError') && (req as any).fileValidationError) {
            const error = new Error('Please upload a supported Image type');
            res.status(415).json({
                message: "Unsupported file extension"
            });
            return next(error);
        } else {
            const response = await s3.listObjectsV2({
                Bucket: 'test-artista',
                Prefix: req.header('uid')
            }).promise();

            const imageObjects = response.Contents ? response.Contents.filter(obj => obj.Key?.endsWith('.jpg')) : [];
            const count = imageObjects.length;

            await s3.upload({
                Bucket: 'test-artista',
                Key: `${req.header('uid')}/image_${count}.jpg`,
                Body: (req as any).file.buffer
            }, async (err: Error, data: any) => {
                if (err) {
                    console.log("Error", err);
                }
                // Success
                if (data) {
                    class CustomError extends Error {
                        httpStatusCode?: number;
                    }

                    if (!(req as any).file) {
                        const error = new CustomError('Please upload an image');
                        error.httpStatusCode = 400;
                        return next(error);
                    }
                }
            });
        }
    } catch (e) {
        console.log(e);
        next(e);
    }
};
