import AWS = require('aws-sdk');
import { config } from './config/config';

const c = config.dev;
//const c = config.aws;

//Configure AWS
//var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
if (c.aws_profile !== "DEPLOYED"){
    var credentials = new AWS.SharedIniFileCredentials({profile: c.aws_profile});
    AWS.config.credentials = credentials;
}


export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: c.aws_region,
  params: {Bucket: c.aws_media_bucket}
});


/* getGetSignedUrl generates an aws signed url to retrieve an item
 * @Params
 *    key: string - the filename to get/retrieve from the s3 bucket
 * @Returns:
 *    a url as a string
 *    eg: 'https://s3-us-east-2.amazonaws.com/udacity-content/images/icon-error.svg';
 */
export function getGetSignedUrl( key: string ): string{

  const signedUrlExpireSeconds = 60 * 5

    const param = { Bucket: c.aws_media_bucket,
                    Key: key,
                    Expires: 60 * 5 }
    const url: string = s3.getSignedUrl('getObject', param);
    return url;
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to put into s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getPutSignedUrl( key: string ){

    const param = { Bucket: c.aws_media_bucket,
                    Key: key,
                    Expires: 60 * 5 }

    const url: string = s3.getSignedUrl('putObject', param);
    return url;
}
