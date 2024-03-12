import * as THREE from "three";

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: 0x00d000 });

export class World extends THREE.Group {
  /**
   *  @type {{
   *      id: number,
   *      instanceID: number
   *  }[][][]}
   */

  data = [];

  threshold = 0.5;

  constructor(size = { width: 64, height: 32 }) {
    super();
    this.size = size;
  }

  /**
   * Generates the world data and meshes
   */
  generate() {
    this.generateTerrain();
    this.generateMeshes();
  }

  /**
   * Generates the world terrain data
   */
  generateTerrain() {
    this.data = [];
    for (let x = 0; x < this.size.width; x++) {
      const slice = [];
      for (let y = 0; y < this.size.height; y++) {
        const row = [];
        for (let z = 0; z < this.size.width; z++) {
          row.push({
            id: Math.random() > this.threshold ? 1 : 0,
            instanceID: null,
          });
        }
        slice.push(row);
      }
      this.data.push(slice);
    }
  }

  /**
   * Generates the 3D representation of the world from the world data
   */
  generateMeshes() {
    this.clear();

    const maxCount = this.size.width * this.size.width * this.size.height;
    const mesh = new THREE.InstancedMesh(geometry, material, maxCount);
    mesh.count = 0;

    const matrix = new THREE.Matrix4();
    for (let x = 0; x < this.size.width; x++) {
        for (let y = 0; y < this.size.height; y++) {
            for (let z = 0; z < this.size.width; z++) {
                const blockId = this.getBlock(x, y, z).id;
                const instanceId = mesh.count;

                if (blockId !== 0) {
                    matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
                    mesh.setMatrixAt(instanceId, matrix);
                    this.setBlockInstanceID(x, y, z, instanceId); // Corrected line
                    mesh.count++;
                }
            }
        }
    }

    this.add(mesh);
}

  /**
   * Gets the block data at (x, y, z)
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {{id: number, instanceID, number}}
   */
  getBlock(x, y, z) {
    if (this.inBounds(x, y, z)) {
      return this.data[x][y][z];
    } else {
      return null;
    }
  }

  /**
   * Sets the block id for the block at (x, y, z)
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} id
   */
  setBlockID(x, y, z, id) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].id = id;
    }
  }

  /**
   * Sets the block instance id for the block at (x, y, z)
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} instanceID
   */

  setBlockInstanceID(x, y, z, instanceID) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].instanceID = instanceID;
    }
  }

  /**
   * Checks if the (x, y, z) coordinates are within bounds
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {boolean}
   */

  inBounds(x, y, z) {
    if (
      x >= 0 &&
      x < this.size.width &&
      y >= 0 &&
      y < this.size.height &&
      z >= 0 &&
      z < this.size.width
    ) {
      return true;
    } else {
      return false;
    }
  }
}
