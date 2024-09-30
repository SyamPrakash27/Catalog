const fs = require('fs');

// Function to read JSON input from file
function readInput(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// Step 1: Parse JSON data and extract points
function extractPoints(data) {
    const n = data.keys.n; // Number of points
    const points = [];

    for (let i = 1; i <= n; i++) {
        if (data[i]) {
            const base = parseInt(data[i].base);
            const yValue = parseInt(data[i].value, base); // Decode y value based on the base
            points.push({ x: i, y: yValue });
        }
    }

    return points;
}

// Step 2: Perform Lagrange Interpolation to find constant term 'c'
function lagrangeInterpolation(points, xValue) {
    let result = 0;

    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                term = term * (xValue - points[j].x) / (points[i].x - points[j].x);
            }
        }
        result += term;
    }

    return result;
}

// Step 3: Find wrong points (those that do not lie on the curve)
function findWrongPoints(points, expectedSecret) {
    const wrongPoints = [];
    points.forEach(point => {
        const computedY = lagrangeInterpolation(points, point.x);
        if (Math.round(computedY) !== point.y) {
            wrongPoints.push(point);
        }
    });
    return wrongPoints;
}

// Step 4: Execute the logic for the test cases
function processTestCase(file) {
    const data = readInput(file);  // Read the test case JSON file
    const points = extractPoints(data); // Extract and decode points

    console.log(`Decoded points for ${file}:`, points);

    const secret = lagrangeInterpolation(points, 0);  // Find the constant term 'c'
    console.log(`Secret (constant term c) for ${file}: ${Math.round(secret)}`);

    // If it's the second test case, check for wrong points
    if (file === 'testcase2.json') {
        const wrongPoints = findWrongPoints(points, secret);
        console.log(`Wrong points in ${file}:`, wrongPoints);
    }
}

// Process the first test case
processTestCase('testcase1.json');

// Process the second test case
processTestCase('testcase2.json');
