// Global THREE.RoundedBoxGeometry for three.js r128 (class-based, ES6)
(function () {
  if (!window.THREE) return;
  THREE.RoundedBoxGeometry = class RoundedBoxGeometry extends THREE.BufferGeometry {
    constructor(width, height, depth, segments, radius) {
      super();
      width = width == null ? 1 : width;
      height = height == null ? 1 : height;
      depth = depth == null ? 1 : depth;
      segments = segments || 2;
      radius = radius != null ? radius : Math.min(width, height, depth) * 0.12;
      radius = Math.max(0.002, radius);

      if (width <= radius * 2 || height <= radius * 2 || depth <= radius * 2) {
        // fall back to plain box when dimensions are too small
        const g = new THREE.BoxGeometry(width, height, depth);
        this.copy(g);
        return;
      }

      const halfW = width / 2;
      const halfH = height / 2;
      const halfD = depth / 2;
      const shape = new THREE.Shape();
      shape.moveTo(-halfW + radius, -halfD);
      shape.lineTo(halfW - radius, -halfD);
      shape.quadraticCurveTo(halfW, -halfD, halfW, -halfD + radius);
      shape.lineTo(halfW, halfD - radius);
      shape.quadraticCurveTo(halfW, halfD, halfW - radius, halfD);
      shape.lineTo(-halfW + radius, halfD);
      shape.quadraticCurveTo(-halfW, halfD, -halfW, halfD - radius);
      shape.lineTo(-halfW, -halfD + radius);
      shape.quadraticCurveTo(-halfW, -halfD, -halfW + radius, -halfD);

      const settings = {
        depth: height,
        bevelEnabled: true,
        bevelSegments: segments,
        steps: 1,
        bevelSize: Math.min(radius, halfW, halfD),
        bevelThickness: Math.min(radius, halfH),
        curveSegments: Math.max(3, segments * 2)
      };
      const geo = new THREE.ExtrudeGeometry(shape, settings);
      geo.center();
      this.copy(geo);
      // material-facing normals / index ready
      this.computeVertexNormals();
    }
  };
  window.RoundedBoxGeometry = THREE.RoundedBoxGeometry;
})();