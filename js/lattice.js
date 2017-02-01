"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mcmc = function () {
  function Mcmc() {
    var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10000;
    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
    var l = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

    _classCallCheck(this, Mcmc);

    this.l = l; // 格子の一辺の長さ(部屋の数)
    this.n = n; // 粒子の挿入処理を行う回数
    this.loop = loop; // 初期配置と同じになる頻度の母数
    this.lattice = null; // 格子の二次元配列．要素は真偽値．true : 粒子あり, false : 空
  }

  /** 配置空間の総数を計算
    return: double．空間配置の総数．
    param:
      l: 格子一辺の長さ(任意)
  **/


  _createClass(Mcmc, [{
    key: "calc",
    value: function calc(l) {
      if (l) {
        this.l = l;
      }
      // loop 回 Markov 連鎖を解き，初期配置と同じになった回数をカウント
      var i = 0;
      var sucCount = 0; // 初期配置と同じ配置になった回数
      while (i < this.loop) {
        // Markov 連鎖を解く
        this.runMarkov();
        // n 回の挿入処理後の格子の正体が初期配置と同じならカウント
        if (this._judgeInitLattice()) {
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

  }, {
    key: "runMarkov",
    value: function runMarkov() {
      // 格子の状態を初期化
      this._init();

      // n 回粒子の挿入処理を行う
      var i = 0;
      while (i < this.n) {
        // 挿入場所をランダムに選出
        var pos = this._choice();
        // コインの状態をランダムに決定
        var coin = this._coin();
        // 周りが空ならばコインの状態に応じて挿入
        if (this._checkAround(pos)) {
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

  }, {
    key: "_init",
    value: function _init() {
      this.lattice = [];
      for (var x = 0; x < this.l; x++) {
        this.lattice[x] = [];
        for (var y = 0; y < this.l; y++) {
          this.lattice[x][y] = false;
        }
      }
    }

    /** 格子の座標をランダムに選出
      return: ランダムな x, y 座標を持った Position
    **/

  }, {
    key: "_choice",
    value: function _choice() {
      var x = Mcmc._genRandom(this.l);
      var y = Mcmc._genRandom(this.l);
      return new Position(x, y);
    }

    /** コインの状態を取得
      return: ランダムな真偽値．
    **/

  }, {
    key: "_coin",
    value: function _coin() {
      return Mcmc._genRandom(2) == 0 ? false : true;
    }

    /** pos の上下左右の座標が全て空か判定
      return: 真偽値．全て空なら true，それ以外なら false
      param:
        pos: 基準座標
    **/

  }, {
    key: "_checkAround",
    value: function _checkAround(pos) {
      var _arr = [-1, 1];

      for (var _i = 0; _i < _arr.length; _i++) {
        var i = _arr[_i];
        if (this.lattice[pos.x + i] && this.lattice[pos.x + i][pos.y]) {
          return false;
        }
        if (this.lattice[pos.x][pos.y + i]) {
          return false;
        }
      }
      return true;
    }

    /** 現在の配置が初期配置と同じか判定
      return: 真偽値．初期配置と同じなら true，それ以外なら false
    **/

  }, {
    key: "_judgeInitLattice",
    value: function _judgeInitLattice() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.lattice[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var calm = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = calm[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var value = _step2.value;

              if (value) {
                return false;
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
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

  }], [{
    key: "_genRandom",
    value: function _genRandom(max) {
      var v = void 0;
      // 稀に Math.random() が 0以上1未満の範囲を越えるため，超えた場合は再度やり直し
      do {
        v = Number.parseInt(Math.random() * max);
      } while (v >= max);
      return v;
    }
  }]);

  return Mcmc;
}();

/** 格子の座標のクラス **/


var Position = function Position(x, y) {
  _classCallCheck(this, Position);

  this.x = x;
  this.y = y;
};

window.mcmc = new Mcmc();

window.onload = function () {

  var go = function go() {
    console.log("Go");
    var loadingDom = document.querySelector(".loading");
    var resDom = document.querySelector("#q.result-value");
    var timeDom = document.querySelector("#t.result-value");
    loadingDom.innerHTML = '<i class="fa fa-refresh fa-spin fa-2x fa-fw"></i>';
    loadingDom.style.opacity = 1;
    resDom.innerHTML = "----";
    timeDom.innerHTML = "----";

    var p = document.querySelector("input#p").value;
    var n = document.querySelector("input#n").value;
    var l = document.querySelector("input#l").value;
    window.mcmc.loop = p;
    window.mcmc.n = n;
    window.mcmc.l = l;
    console.log("loop = " + p, "n = " + n, "l = " + l);

    window.setTimeout(function () {
      var start = new Date();
      var res = window.mcmc.calc().toFixed(2);
      var end = new Date();
      var time = end - start;
      console.log("result = " + res + ", time = " + time + "ms");
      loadingDom.style.opacity = 0;
      loadingDom.innerHTML = "";
      resDom.innerHTML = res;
      timeDom.innerHTML = time;
    }, 0);
  };

  document.querySelector("input#p").value = window.mcmc.loop;
  document.querySelector("input#n").value = window.mcmc.n;
  document.querySelector("input#l").value = window.mcmc.l;

  console.log("start");
  document.querySelector('.go-button').addEventListener('click', go);
};