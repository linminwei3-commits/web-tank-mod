(function() {
  // 1. 尋找遊戲的 3D 場景與玩家物件
  const scene = window.scene || (window.game && window.game.scene);
  const player = window.player || (window.game && window.game.player);

  if (!scene) {
    alert("未找到 3D 場景，請等待遊戲完全載入後再試！");
    return;
  }

  // 2. 引入 Three.js 模型載入器
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/GLTFLoader.js';
  
  script.onload = () => {
    const loader = new THREE.GLTFLoader();
    
    // 指向剛才上傳的模型直鏈
    const tankUrl = 'https://cdn.jsdelivr.net/gh/linminwei3/web-tank-mod@main/tank.glb';

    loader.load(tankUrl, (gltf) => {
      const tank = gltf.scene;
      tank.scale.set(1.5, 1.5, 1.5);
      scene.add(tank);

      let isDriving = false;

      // 3. 建立控制按鈕
      const btn = document.createElement('button');
      btn.innerText = '上車';
      btn.style.cssText = `
        position: fixed;
        bottom: 120px;
        right: 40px;
        z-index: 99999;
        padding: 16px;
        border-radius: 50%;
        background: #a92233;
        color: white;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
      `;
      document.body.appendChild(btn);

      btn.onclick = () => {
        isDriving = !isDriving;
        btn.innerText = isDriving ? '開火' : '上車';
        if (player) {
          player.visible = !isDriving;
        }
      };

      // 4. 同步坦克與玩家位置
      function loop() {
        if (isDriving && player) {
          tank.position.copy(player.position);
          tank.rotation.copy(player.rotation);
        }
        requestAnimationFrame(loop);
      }
      loop();

      alert("坦克注入成功！點擊畫面右下角按鈕試試看。");
    }, undefined, (err) => {
      console.error(err);
      alert("載入坦克模型失敗，請確認檔案名稱是否正確！");
    });
  };

  document.head.appendChild(script);
})();
