export { addSceneEventListeners };

function addSceneEventListeners (that) {
    that.input.keyboard.on(
        "keydown_ZERO",
            function () {
                that.scene.start('PickLevel');
            }
    );
}
