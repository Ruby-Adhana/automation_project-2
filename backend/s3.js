const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: "AKIAXCEWP5BAJRV5C6X3",
  secretAccessKey: "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",
  region: "ap-south-1"
});

const s3 = new AWS.S3();

module.exports = s3;
