import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';

export function createUI(world) {
    const gui = new GUI();

    gui.add(world.size, 'width', 8, 128, 1).name('Width');
    gui.add(world.size, 'height', 8, 64, 1).name('Height');
    gui.add(world, 'generate');
}