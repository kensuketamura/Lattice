class Mcmc {
  constructor(loop = 10000, n = 1000, l = 2) {
    this.l = l;           // 格子の一辺の長さ(部屋の数)
    this.n = n;           // 粒子の挿入処理を行う回数
    this.loop = loop;     // 初期配置と同じになる頻度の母数
    this.lattice = null;  // 格子の二次元配列．要素は真偽値．true : 粒子あり, false : 空
  }

  /** 配置空間の総数を計算
    return: double．空間配置の総数．
    param:
      l: 格子一辺の長さ(任意)
  **/
  calc (l) {
    if(l){
      this.l = l;
    }
    // loop 回 Markov 連鎖を解き，初期配置と同じになった回数をカウント
    let i = 0;
    let sucCount = 0;     // 初期配置と同じ配置になった回数
    while(i < this.loop) {
      // Markov 連鎖を解く
      this.runMarkov();
      // n 回の挿入処理後の格子の正体が初期配置と同じならカウント
      if(this._judgeInitLattice()){
        sucCount++;
      }
      i++;
    }
    // 初期配置になる頻度の逆数(配置空間の総数)を返す
    return this.loop / sucCount;
  }

  /** Markov 連鎖を１回解いて格子の状態を更新
    return: void
  **/
  runMarkov() {
    // 格子の状態を初期化
    this._init();

    // n 回粒子の挿入処理を行う
    let i = 0;
    while(i < this.n) {
      // 挿入場所をランダムに選出
      let pos = this._choice();
      // コインの状態をランダムに決定
      let coin = this._coin();
      // 周りが空ならばコインの状態に応じて挿入
      if(this._checkAround(pos)) {
        this.lattice[pos.x][pos.y] = coin;
      } else {
        this.lattice[pos.x][pos.y] = false;
      }
      i++;
    }
    // console.log(this.lattice);
  }

  /** 格子の二次元配列を全て false で初期化．
    return: void
  **/
  _init () {
    this.lattice = [];
    for(let x = 0; x < this.l; x++){
      this.lattice[x] = [];
      for(let y = 0; y < this.l; y++){
        this.lattice[x][y] = false;
      }
    }
  }

  /** 格子の座標をランダムに選出
    return: ランダムな x, y 座標を持った Position
  **/
  _choice () {
    let x = Mcmc._genRandom(this.l);
    let y = Mcmc._genRandom(this.l);
    return new Position(x, y);
  }

  /** コインの状態を取得
    return: ランダムな真偽値．
  **/
  _coin () {
    return (Mcmc._genRandom(2) == 0)? false : true;
  }

  /** pos の上下左右の座標が全て空か判定
    return: 真偽値．全て空なら true，それ以外なら false
    param:
      pos: 基準座標
  **/
  _checkAround (pos) {
    for(let i of [-1, 1]) {
      if(this.lattice[pos.x + i] && this.lattice[pos.x + i][pos.y]) {
        return false;
      }
      if(this.lattice[pos.x][pos.y + i]) {
        return false;
      }
    }
    return true;
  }

  /** 現在の配置が初期配置と同じか判定
    return: 真偽値．初期配置と同じなら true，それ以外なら false
  **/
  _judgeInitLattice() {
    for(let calm of this.lattice){
      for(let value of calm) {
        if(value) {
          return false;
        }
      }
    }
    return true;
  }

  /** 乱数生成．
    return: max未満0以上の整数
    param:
      max: 乱数の最大値
  **/
  static _genRandom(max) {
    let v;
    // 稀に Math.random() が 0以上1未満の範囲を越えるため，超えた場合は再度やり直し
    do {
      v = Number.parseInt(Math.random() * max);
    } while(v >= max)
    return v;
  }
}

/** 格子の座標のクラス **/
class Position {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }
}


window.draw = function (lattice) {

}

window.mcmc = new Mcmc();

window.onload = function() {

  var go = function () {
    console.log("Go");
    let loadingDom = document.querySelector(".loading");
    let resDom = document.querySelector("#q.result-value");
    let timeDom = document.querySelector("#t.result-value");
    loadingDom.innerHTML = '<i class="fa fa-refresh fa-spin fa-2x fa-fw"></i>';
    loadingDom.style.opacity = 1;
    resDom.innerHTML = "----";
    timeDom.innerHTML = "----";

    let p = document.querySelector("input#p").value;
    let n = document.querySelector("input#n").value;
    let l = document.querySelector("input#l").value;
    window.mcmc.loop = p;
    window.mcmc.n = n;
    window.mcmc.l = l;
    console.log("loop = " + p, "n = " + n, "l = " + l,);

    window.setTimeout(()=>{
      let start = new Date();
      let res = window.mcmc.calc().toFixed(2);
      let end = new Date();
      let time = end - start;
      console.log("result = " + res + ", time = " + time + "ms");
      loadingDom.style.opacity = 0;
      loadingDom.innerHTML = "";
      resDom.innerHTML = res;
      timeDom.innerHTML = time;
    },0);
  }

  document.querySelector("input#p").value = window.mcmc.loop;
  document.querySelector("input#n").value = window.mcmc.n;
  document.querySelector("input#l").value = window.mcmc.l;

  console.log("start");
  document.querySelector('.go-button').addEventListener('click', go);
}
