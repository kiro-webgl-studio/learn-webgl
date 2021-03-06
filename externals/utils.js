(function (window, define) {

    function createCanvasWithFallback(width, height, fallbackElement) {
        let canvas = document.createElement('canvas');
        let fallbackText = typeof fallbackElement === 'string' ? fallbackElement : undefined;
        if (fallbackText) {
            canvas.innerText = fallbackText;
        } else {
            canvas.appendChild(fallbackElement);
        }
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        return canvas;
    }

    function getWebGLContextAfterCheck(canvas, failHandler) {
        this.gl = canvas.getContext("experimental-webgl");
        if (!this.gl) failHandler();

        return this.gl;
    };

    function getShaderById(id, type) {
        let element = document.querySelector(id)
        return element ? _initShader(element.innerText, type) : undefined;
    }

    function _initShader(content, type) {
        let shader;
        type = `${type}_shader`.toUpperCase();

        let gl = utils.gl;

        if (gl[type]) {
            shader = gl.createShader(gl[type]);
            gl.shaderSource(shader, content);
            gl.compileShader(shader);
        }

        _getShaderStatusWhenError(shader, 'compile', () => {
            console.log(gl.getShaderInfoLog(shader));
        })

        return shader
    }

    function createProgramWithLimitShader(...shaders) {
        let gl = this.gl;

        let shaderProgram = gl.createProgram();

        shaders.forEach((shader) => {
            gl.attachShader(shaderProgram, shader);
        })
        gl.linkProgram(shaderProgram);

        _getProgramStatusWhenError(shaderProgram, 'link', () => {
            console.error("[Error]: Could not initialise shaders");
        })

        gl.useProgram(shaderProgram);

        return shaderProgram;
    }

    function _getShaderStatusWhenError(shader, type, handler) {
        let status;
        type = `${type}_status`.toUpperCase();

        let gl = utils.gl;

        if (!gl[type]) {
            return;
        }

        status = gl.getShaderParameter(shader, gl[type]);
        if (!status) {
            handler();
        }
    }

    function _getProgramStatusWhenError(program, type, handler) {
        let status;
        type = `${type}_status`.toUpperCase();

        let gl = utils.gl;

        if (!gl[type]) {
            return;
        }

        status = gl.getProgramParameter(program, gl[type]);
        if (!status) {
            handler();
        }
    }

    function createBuffer(bufferArray, itemSize, itemNum, type = 'static') {
        let gl = this.gl;

        let _buffer = gl.createBuffer();
        type = `${type}_draw`.toUpperCase();

        gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferArray), gl[type]);

        _buffer.itemSize = itemSize;
        _buffer.itemNum = itemNum;

        return _buffer;
    }

    let utils = {
        gl: undefined,
        createBuffer,
        createCanvasWithFallback,
        getWebGLContextAfterCheck,
        getShaderById,
        createProgramWithLimitShader
    };

    window._Utils = utils;

})(window, define = {});