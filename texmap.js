// Andrew Duerr
// CS 435
// April 1st, 2019
// The purpose of this project was to map textures to a scene.
// Unfortunately, I wasn't able to get the screen to play.

var canvas;
var gl;

var numVertices  = 0;

var texSize = 64;

var program;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texture;

var texCoord = [
  vec2(0/2048     ,0/2048),       //0
  vec2(512/2048   ,0/2048),       //1
  vec2(1024/2048  ,0/2048),       //2
  vec2(1536/2048  ,0/2048),       //3
  vec2(2048/2048  ,0/2048),       //4
  vec2(0/2048     ,512/2048),     //5
  vec2(512/2048   ,512/2048),     //6
  vec2(1024/2048  ,512/2048),     //7
  vec2(1536/2048  ,512/2048),     //8
  vec2(2048/2048  ,512/2048),     //9
  vec2(0/2048     ,1024/2048),    //10
  vec2(512/2048   ,1024/2048),    //11
  vec2(1024/2048  ,1024/2048),    //12
  vec2(1536/2048  ,1024/2048),    //13
  vec2(2048/2048  ,1024/2048),    //14
  vec2(0/2048     ,1536/2048),    //15
  vec2(512/2048   ,1536/2048),    //16
  vec2(1024/2048  ,1536/2048),    //17
  vec2(1536/2048  ,1536/2048),    //18
  vec2(2048/2048  ,1536/2048),    //19
  vec2(0/2048     ,2048/2048),    //20
  vec2(512/2048   ,2048/2048),    //21
  vec2(1024/2048  ,2048/2048),    //22
  vec2(1536/2048  ,2048/2048),    //23
  vec2(2048/2048  ,2048/2048),    //24
];

var vertices = [
        vec4( -100, -100,  100, 1.0 ),
        vec4( -100,  100,  100, 1.0 ),
        vec4( 100,  100,  100, 1.0 ),
        vec4( 100, -100,  100, 1.0 ),
        vec4( -100, -100, -100, 1.0 ),
        vec4( -100,  100, -100, 1.0 ),
        vec4( 100,  100, -100, 1.0 ),
        vec4( 100, -100, -100, 1.0 ),
    ];

var tvVertices = [
  vec4( -50, -50,  50, 1.0 ),
  vec4( -50,  50,  50, 1.0 ),
  vec4( 50,  50,  50, 1.0 ),
  vec4( 50, -50,  50, 1.0 ),
  vec4( -50, -50, -50, 1.0 ),
  vec4( -50,  50, -50, 1.0 ),
  vec4( 50,  50, -50, 1.0 ),
  vec4( 50, -50, -50, 1.0 ),
];

var vertexColors = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black   0
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red     1
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow  2
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green   3
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue    4
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta 5
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan    6
        vec4( 1.0, 1.0, 1.0, 1.0 ),  // white   7
    ];

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

var near = -200;
var far = 500;
var radius = 1.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -175.0;
var right = 175.0;
var ytop = 175.0;
var bottom = -175.0;


var mvMatrix, pMatrix;
var modelView, projection;
var eye;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 100.0, 0.0);

// quad uses first index to set color for face

function quad(a, b, c, d, color) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[color]);
     numVertices += 6;
}

function tvQuad(a, b, c, d, color) {
     pointsArray.push(tvVertices[a]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(tvVertices[b]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(tvVertices[c]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(tvVertices[a]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(tvVertices[c]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(tvVertices[d]);
     colorsArray.push(vertexColors[color]);
     numVertices += 6;
}
// Each face determines two triangles

// function colorCube()
// {
//     quad( 1, 0, 3, 2, 1);
//     quad( 2, 3, 7, 6, 2);
//     quad( 3, 0, 4, 7, 3);
//     quad( 6, 5, 1, 2 ,6);
//     quad( 4, 5, 6, 7 ,4);
//     quad( 5, 4, 0, 1 ,5);
// }

function room(){
  quad(3,7,4,0,3);
  quad(1,5,4,0,1);
  quad(4,5,6,7,4);
  //== floor
  texCoordsArray.push(texCoord[3]);
  texCoordsArray.push(texCoord[8]);
  texCoordsArray.push(texCoord[9]);
  texCoordsArray.push(texCoord[3]);
  texCoordsArray.push(texCoord[9]);
  texCoordsArray.push(texCoord[4]);
  //== left wall
  texCoordsArray.push(texCoord[11]);
  texCoordsArray.push(texCoord[12]);
  texCoordsArray.push(texCoord[7]);
  texCoordsArray.push(texCoord[11]);
  texCoordsArray.push(texCoord[7]);
  texCoordsArray.push(texCoord[6]);
  //== right wall
  texCoordsArray.push(texCoord[7]);
  texCoordsArray.push(texCoord[12]);
  texCoordsArray.push(texCoord[13]);
  texCoordsArray.push(texCoord[7]);
  texCoordsArray.push(texCoord[13]);
  texCoordsArray.push(texCoord[8]);
}

function tv(){
  tvQuad( 1, 0, 3, 2, 6); // front/screen
  tvQuad( 2, 3, 7, 6, 5); // right
  tvQuad( 6, 5, 1, 2, 2); // top
  //== Screen
  texCoordsArray.push(texCoord[23]);
  texCoordsArray.push(texCoord[18]);
  texCoordsArray.push(texCoord[19]);
  texCoordsArray.push(texCoord[23]);
  texCoordsArray.push(texCoord[19]);
  texCoordsArray.push(texCoord[24]);
  //== side
  texCoordsArray.push(texCoord[7]);
  texCoordsArray.push(texCoord[2]);
  texCoordsArray.push(texCoord[1]);
  texCoordsArray.push(texCoord[7]);
  texCoordsArray.push(texCoord[1]);
  texCoordsArray.push(texCoord[6]);
  //== top
  texCoordsArray.push(texCoord[2]);
  texCoordsArray.push(texCoord[7]);
  texCoordsArray.push(texCoord[8]);
  texCoordsArray.push(texCoord[2]);
  texCoordsArray.push(texCoord[8]);
  texCoordsArray.push(texCoord[3]);
}

function leg(x, y, color, color2){
  // vec4( -50, -50,  50, 1.0 ),   0
  // vec4( -50,  50,  50, 1.0 ),   1
  // vec4( 50,  50,  50, 1.0 ),    2
  // vec4( 50, -50,  50, 1.0 ),    3
  // vec4( -50, -50, -50, 1.0 ),   4
  // vec4( -50,  50, -50, 1.0 ),   5
  // vec4( 50,  50, -50, 1.0 ),    6
  // vec4( 50, -50, -50, 1.0 ),    7
  pointsArray.push(vec4( x-10,  -50,  y, 1.0 ));
  colorsArray.push(vertexColors[color]);
  pointsArray.push(vec4( x-10, -100,  y, 1.0 ));
  colorsArray.push(vertexColors[color]);
  pointsArray.push(vec4( x, -100,  y, 1.0 ));
  colorsArray.push(vertexColors[color]);
  pointsArray.push(vec4( x-10,  -50,  y, 1.0 ));
  colorsArray.push(vertexColors[color]);
  pointsArray.push(vec4( x, -100,  y, 1.0 ));
  colorsArray.push(vertexColors[color]);
  pointsArray.push(vec4( x,  -50,  y, 1.0 ));
  colorsArray.push(vertexColors[color]);
  //========
  pointsArray.push(vec4( x,  -50,  y, 1.0 ));
  colorsArray.push(vertexColors[color2]);
  pointsArray.push(vec4( x, -100,  y, 1.0 ));
  colorsArray.push(vertexColors[color2]);
  pointsArray.push(vec4( x, -100, y-10, 1.0 ));
  colorsArray.push(vertexColors[color2]);
  pointsArray.push(vec4( x,  -50,  y, 1.0 ));
  colorsArray.push(vertexColors[color2]);
  pointsArray.push(vec4( x, -100, y-10, 1.0 ));
  colorsArray.push(vertexColors[color2]);
  pointsArray.push(vec4( x,  -50, y-10, 1.0 ));
  colorsArray.push(vertexColors[color2]);
  //== front of leg
  texCoordsArray.push(texCoord[2]);
  texCoordsArray.push(texCoord[7]);
  texCoordsArray.push(texCoord[8]);
  texCoordsArray.push(texCoord[2]);
  texCoordsArray.push(texCoord[8]);
  texCoordsArray.push(texCoord[3]);
  //== side of leg
  texCoordsArray.push(texCoord[0]);
  texCoordsArray.push(texCoord[5]);
  texCoordsArray.push(texCoord[6]);
  texCoordsArray.push(texCoord[0]);
  texCoordsArray.push(texCoord[6]);
  texCoordsArray.push(texCoord[1]);

  numVertices += 12;
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // colorCube();
    room();
    leg(50,50,7,0);
    leg(-40,-40,7,0);
    leg(50,-40,7,0);
    leg(-40,50,7,0);
    tv();
    // console.log("%d",numVertices);
    // leg(10,2,1);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

// buttons to change viewing parameters

    // document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;};
    // document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};
    // document.getElementById("Button3").onclick = function(){radius *= 1.1;};
    // document.getElementById("Button4").onclick = function(){radius *= 0.9;};
    // document.getElementById("Button5").onclick = function(){theta += dr;};
    // document.getElementById("Button6").onclick = function(){theta -= dr;};
    // document.getElementById("Button7").onclick = function(){phi += dr;};
    // document.getElementById("Button8").onclick = function(){phi -= dr;};

    var image = document.getElementById("texImage");

    configureTexture( image );

    render();
}


var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        eye = vec3(radius*Math.sin(phi+(dr*7)), radius*Math.sin(theta+(dr*2)),
             radius*Math.cos(phi+(dr*7)));

        mvMatrix = lookAt(eye, at , up);
        pMatrix = ortho(left, right, bottom, ytop, near, far);

        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

        gl.drawArrays( gl.TRIANGLES, 0, numVertices );
        requestAnimFrame(render);
    }
