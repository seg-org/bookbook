import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadToBucket = async (folder: string, file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${folder}/${Date.now()}-${file.name}`,
      Body: buffer,
      ContentType: file.type,
    };

    const data = await s3.upload(uploadParams).promise();

    return data;
  } catch (error) {
    console.error("Error uploading file", error);
    throw new Error("Cannot upload file");
  }
};

export const getUrl = async (folder: string, key: string) => {
  // const signedUrl = s3.getSignedUrl("getObject", {
  //   Bucket: process.env.AWS_BUCKET_NAME!,
  //   Key: `${folder}/${key}`,
  //   Expires: 3600,
  // });

  // return signedUrl;
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${folder}/${key}`;
};

export const deleteObject = async (folder: string, key: string): Promise<boolean> => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${folder}/${key}`,
    };

    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error("Error deleting object from S3:", error);
    return false;
  }
};
