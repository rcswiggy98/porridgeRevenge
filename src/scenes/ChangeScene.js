export { addSceneEventListeners };

function addSceneEventListeners (that) {
    that.input.keyboard.on(
        "keydown_ZERO",
            function () {
                that.scene.start('Level1');
            }
    );
    that.input.keyboard.on(
        "keydown_ONE",
            function () {
                that.scene.start('Level2');
            }
    );
}
