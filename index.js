let net;

const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();

async function setupWebcam() {
    return new Promise ((resolve, reject) => {
        const navigaotrAny = navigator;
        navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true},
            stream => {
                webcamElement.srcObject = stream;
                webcamElement.addEventListener('loadeddata', () => resolve(), false)   
            },
            error => PromiseRejectionEvent());
        } else {
            PromiseRejectionEvent();
        }
    })
}

async function app() {
    console.log('Loading mobilenet...');

    //load the model.
    net = await mobilenet.load()
    console.log('Sucessfully loaded model')

    await setupWebcam();
    
    const addExample = classId => {
        const activation = net.infer(webcamElement, 'conv_preds');

        classifier.addExample(activation, classId);
    };

    // When clicking a button, add an example for that class.
    document.getElementById('class-a').addEventListener('click', () => addExample(0));
    document.getElementById('class-b').addEventListener('click', () => addExample(1));
    document.getElementById('class-c').addEventListener('click', () => addExample(2));


    while(true) {
        if(classifier.getNumClasses() > 0) {
            const activation = net.infer(webcamElement, 'conv_preds');
            const result = await classifier.predictClass(activation);

            const classes = ['A', 'B', 'C'];

            document.getElementById('console').innerText = `
                prediction: ${classes[result.classIndex]}\n
                probability: ${result.confidences[result.classIndex]}
            `;
        }
        // Give some breathing room by waiting for the next animation frame to fire
        await tf.nextFrame()
    }


    //make a prediction through the model on our image
    // const imgEl = document.getElementById('img');

    // const result = await net.classify(imgEl);

    console.log(result);
}

app();