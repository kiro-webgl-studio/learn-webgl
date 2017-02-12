declare type IShaderType = 'vertex' | 'fragment';

class Program {
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    element: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.element = canvas;
        this.create(canvas);
    }

    private create(canvas: HTMLCanvasElement): void {
        this.gl = canvas.getContext("experimental-webgl");
        this.program = this.gl.createProgram();
    }

    getShaderById(id: string, type: IShaderType): WebGLShader {
        let element: HTMLScriptElement = <HTMLScriptElement>document.querySelector(id)
        return element ? this.initShader(element.innerText, type) : undefined;
    }

    addShader(...shaders: WebGLShader[]) {
        let status;
        shaders.forEach((shader) => {
            this.attachShader(shader);
        })
        this.linkProgram();
        status = this.gl.getProgramParameter(this.program, this.gl[Program.upperCaseStatus('link')]);

        this.useProgram();
    }

    private initShader(content: string, type: IShaderType): WebGLShader {
        let shader, gl = this.gl;
        let uType = Program.upperCaseShader(type);
        status = this.gl.getShaderParameter(shader, this.gl[uType]);
        if (!status) {
            // handler();
        }

        shader = gl.createShader(gl[uType]);
        shader.type = type;
        gl.shaderSource(shader, content);
        gl.compileShader(shader);

        return shader
    }

    attachShader(shader: WebGLShader): void{
        this.gl.attachShader(this.program, shader)
    }

    linkProgram(program?: WebGLProgram): void{
        this.gl.linkProgram(program || this.program);
    }

    useProgram(program?: WebGLProgram): void{
        this.gl.useProgram(program || this.program);
    }

    static upperCaseShader(type: IShaderType): string {
        return `${type}_shader`.toUpperCase();
    }

    static upperCaseStatus(type: string): string {
        return `${type}_status`.toUpperCase();
    }
}