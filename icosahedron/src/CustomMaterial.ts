import { MeshPhongMaterial, MeshPhongMaterialParameters } from 'three';

interface CustomMaterialParams extends MeshPhongMaterialParameters {
  displacement: number;
  elevation: number;
  speed: number;
}

export class CustomMaterial extends MeshPhongMaterial {
  constructor(parameters: CustomMaterialParams) {
    super(parameters);
    this.onBeforeCompile = (shader) => {
      shader.uniforms.time = {
        value: 0.0,
      };
      shader.uniforms.displacement = {
        value: parameters.displacement,
      };
      shader.uniforms.elevation = {
        value: parameters.elevation,
      };
      shader.uniforms.speed = {
        value: parameters.speed,
      };

      shader.vertexShader =
        `uniform float time;
            uniform float displacement;
            uniform float elevation;
            uniform float speed;\n` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        [
          'float factor = abs(sin(time)) * displacement;',
          'vec3 offset = normal * factor;',
          'float waveY = abs(sin(position.y + time * speed)) * elevation;',
          'vec3 transformed = vec3(position + waveY * offset);',
        ].join('\n'),
      );

      this.userData.shader = shader;
    };
  }
}
