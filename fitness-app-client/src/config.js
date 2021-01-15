const config = {
    s3: {
        REGION: "us-east-2",
        BUCKET: "workout-gifs-bucket",
    },
    apiGateway: {
        REGION: "us-east-2",
        URL: "https://z256forypj.execute-api.us-east-2.amazonaws.com/prod",
    }
};

export default config;