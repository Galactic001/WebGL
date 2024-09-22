var WebGL = function () {
	var gl, shaderProgram;
    var isSpacePressed = false;
    var isWPressed = false;
    var isAPressed = false;
    var isSPressed = false;
    var isDPressed = false;

    document.addEventListener('keydown', function(event) {
        switch(event.code) {
            case 'Space':
                isSpacePressed = true;
                break;
            case 'KeyW':
                isWPressed = true;
                break;
            case 'KeyA':
                isAPressed = true;
                break;
            case 'KeyS':
                isSPressed = true;
                break;
            case 'KeyD':
                isDPressed = true;
                break;
        }
    });

    document.addEventListener('keyup', function(event) {
        switch(event.code) {
            case 'Space':
                isSpacePressed = false;
                break;
            case 'KeyW':
                isWPressed = false;
                break;
            case 'KeyA':
                isAPressed = false;
                break;
            case 'KeyS':
                isSPressed = false;
                break;
            case 'KeyD':
                isDPressed = false;
                break;
        }
    });
    
	gl = initializeWebGL(gl);

	//Step 1 (Set background color): First specify the color with the help of Quadlet(R,G,B,Alpha) and the clear the buffer related to background.
	gl.clearColor(0, 0, 0, 1.0);	
	gl.clear(gl.COLOR_BUFFER_BIT);
	//Note: The default background color in WebGl is white.

	//Step 2 (Speficy vertices data): Speficy the coordinates (X,Y,Z) of the geometry and other information related to each coordinates.
    var verticesDataArrayJS = [
        0.0, 0.6,0,	//0
		-0.1, 0.2,0,	//1
		0.1, 0.2,0,	//2
		0.5, 0.1,0,	//3
		0.1, 0.0,0,	//4
		0.0, -0.4,0,	//5
		-0.1, 0.0,0,	//6
		-0.5, 0.1,0,	//7
    ];
    
    var IndicesArrayJS = [
       0,1,2,
	   2,3,4,
	    4,5,6,
	    6,7,1
    ];
    
    

	//Step 4 (Create GPU meomry buffer): In the GPU for holding vertices data of type ARRAY_BUFFER.
	var rectVBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, rectVBO);

	//Step 5 (Pass the vertices data to the buffer created previously).
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesDataArrayJS), gl.STATIC_DRAW);

	//Step 6 (Pass the indices data to GPU buffer): repeat the steps 4 and 5 for the indices data but use ELEMENT_ARRAY_BUFFER.
	var rectIBO = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectIBO);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(IndicesArrayJS), gl.STATIC_DRAW);

	//Seven Steps Shader side coding in JS to get the shader program.
	shaderProgram = getShaderProgram(gl);

	//Step 14 (Use the shader program):
	gl.useProgram(shaderProgram);

	//Step 15 (Get access to GPU's geometry coordinates): Get the pointer to the geometry coordinates defined in vertex shader through the shader program.
	var positionAttribLocation = gl.getAttribLocation(shaderProgram, 'geometryCoordinatesGPU');
	var tranMatGPUPointer = gl.getUniformLocation(shaderProgram, 'tranMatGPU');
	
	//Step 16 (Enable Vertex Attribute Array): It enables the pointer defined in Step 8 to access the vertex buffered data.
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(tranMatGPUPointer);

	//Step 17 (Buffer data definition): Define how the data on the GPU buffer is arranged. SO that the pointer defined in Step 8 can access the data from the buffer.
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	

	//Step 18 (Draw the geometry): Issue the draw command to generate the geometry as defined by the indices and the type of primitive to create.
    // Animation variables
// Initial position at the bottom center
var position = { x: 0, y: 0 };

// Mouse position in WebGL coordinates
var mousePosition = { x: 0, y: 0 };

// Convert mouse position to WebGL coordinates
function updateMousePosition(event) {
    var rect = canvas.getBoundingClientRect();
    mousePosition.x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
    mousePosition.y = -(((event.clientY - rect.top) / canvas.height) * 2 - 1);
}

canvas.addEventListener('mousemove', updateMousePosition);
function normalizeDirection(x, y) {
    var length = Math.sqrt(x * x + y * y);
    return { x: x / length, y: y / length };
}

var angle = 0;

var loop = function () {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Calculate direction vector towards mouse position
    var dirX = mousePosition.x - position.x;
    var dirY = mousePosition.y - position.y;
    var mag = Math.sqrt(dirX * dirX + dirY * dirY);
    dirX /= mag;
    dirY /= mag;

    // Move towards or away from the cursor
    if (isWPressed) {
        position.x += dirX * 0.01; // Speed could be adjusted
        position.y += dirY * 0.01;
    } else if (isSPressed) {
        position.x -= dirX * 0.01;
        position.y -= dirY * 0.01;
    }
	if (isAPressed) {
        angle -= 0.09;  // Rate of rotation
    } 
    if (isDPressed) {  
        angle += 0.09;
    } 
    
    

    // Calculate the angle between the rocket and the mouse cursor
    var angleToMouse = Math.atan2(mousePosition.y - position.y, mousePosition.x - position.x) - Math.PI / 2;

    // Update transformation matrix for the rocket
// Update transformation matrix for the rocket
var cosRad = Math.cos(angleToMouse + angle);
var sinRad = Math.sin(angleToMouse + angle);
var Sx = 0.5, Sy = 0.5; // Scale down to 0.5 times

// Rotation Matrix around Z-axis
var rotationMatrix = [
    cosRad, -sinRad,  0,  0,
    sinRad,  cosRad,  0,  0,
    0,       0,       1,  0,     
    0,       0,       0,  1  
];

// Combine rotation, scaling and translation in the right order 
var tranArrayJS = new Float32Array([
    Sx * rotationMatrix[0], Sx * rotationMatrix[1], 0, 0,
    Sy * rotationMatrix[4], Sy * rotationMatrix[5], 0, 0,
    0,  0, 1, 0,
    position.x, position.y, 0, 1
]);

gl.uniformMatrix4fv(tranMatGPUPointer, gl.FALSE, tranArrayJS); 

    gl.drawElements(gl.TRIANGLES, IndicesArrayJS.length, gl.UNSIGNED_SHORT, 0);

    // Launch a projectile if space is pressed
    if (isSpacePressed) {
        // For simplicity, let's just log "Projectile launched!"
        // Actual implementation will involve creating a new projectile,
        // setting its initial position and direction, and updating its state in the loop
        console.log("Projectile launched!");
    }

    requestAnimationFrame(loop);
};
loop();


};


function initializeWebGL(gl)
{
	var canvas = document.getElementById('canvas');

	canvas.width = window.innerWidth;;
	canvas.height = window.innerHeight;;

	gl = canvas.getContext('webgl2');

	if (!gl) {
		alert('Your browser does not support WebGL');
		return;
	}
    
	return gl;
}


//Seven steps of Shader side coding
function getShaderProgram(gl)
{
	//Step 7 (Define vertex shader text): Define the code of the vertex shader in the form of JS text.
	var vertexShaderText = `#version 300 es
	#pragma vscode_glsllint_stage: vert			
	in vec3 geometryCoordinatesGPU;		
	uniform mat4 tranMatGPU;
	void main()
	{
		gl_Position = tranMatGPU * vec4(geometryCoordinatesGPU, 1.0); 
	}`;

	//Step 8 (Create actual vertex shader): Create the actual vertex shader with the text defined in Step 1.
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexShaderText);

	//Step 9 (Compile vertex shader):
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	//Step 10: Repeat the above 3 steps for fragment shader.
	var fragmentShaderText = `#version 300 es
	#pragma vscode_glsllint_stage: frag
	precision mediump float;
	out vec4 fragColor;		
	void main()
	{
		fragColor = vec4(0.0, 1.0, 0.0, 1.0);;
	}`;

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	//Step 11 (Shader program): With the compiled vertex and fragment shader, create the shader program.
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);

	//Step 12 (Link shader program): 
	gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(shaderProgram));
		return;
	}

	//Step 13 (Validate Shader program): Checks if the shader program has been succesfully linked and can be used further.
	gl.validateProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(shaderProgram));
		return;
	}
	return shaderProgram;
}