WindowsのExplorerを始めとする各種ファイル操作GUIのように、

+ フォームのサイズ変更、移動
+ サイズの上限、下限、範囲設定
+ 重なりの切り替え
+ クリック、ドラッグ、ShiftとCtrlを使った要素の選択
+ フォーム間の要素の移動／コピー
+ ドラッグによる要素選択時の、自動スクロール機能

を実現します。

##使用方法

###下準備

ラッパーとなるブロック要素を用意し、CSSで以下の設定をして下さい。

    // #wrapper = 任意のブロック要素
    #wrapper {
        position: relative もしくは absolute;
    }
     
    #wrapper * {
        -webkit-user-select:none;
        -khtml-user-select: none;
        -moz-user-select:   none;
        user-select:        none;
    }

positionをrelativeかabsoluteにするのは、フォームの位置計算方法を統一するためです。それ以外の場合は表示が狂います。また、それ以降の項目は、テキスト選択機能を無効にしドラッグによる選択時の誤作動を防ぐものです。ちらつきを最小限に抑えつつ誤作動も防ぐには、body内の全ての要素を原則選択禁止にした上で、選択を可能にしたい要素のみ個別に許可する方式が最も望ましいです。1

###スクリプト上の手順

- パラメータ設定
- フォーム作成
- 初期化処理

の3手順を踏む必要があります。具体的には、


    (function(hdemon){
     
    // グローバルに名前空間"hdemon"が置かれる。
    // そこから、explorizerメソッドを呼び出す。
    form = hdemon.explorizer
     
        // パラメータ設定。フォームのラッパー要素指定である"$wrapper"が、唯一必須。
        // $wrapperには、jQueryオブジェクトを与える。
        .set({
            "$wrapper"     : $("#wrapper")
            "width"        : 200,
            "height"       : 300    })
     
        // addメソッドで、パラメータに従ったフォームを作成。
        .add() // new window-form creation.
     
    // addの戻り値は、
    {
        "$form"    // フォームの一番外側の要素で、座標を決める。
        "$content" // フォームの最も内側の要素で、ここに好きな要素を追加することができる。
        "formId"   // ユニークで不変のフォームID
    }
     
    // であり、次のように使う。
    form.$content
        .append(/*任意の要素。文章とかアイコンとか。*/)
        .css({ "top" : 200 , "left" : 300 });
     
    // そして、フォーム内に要素を追加／削除した場合には、
    // 次のように明示的に初期化処理を行う必要がある。
    // 初期化処理後、フォーム内の要素は選択／移動・コピー対象になる。
    hdemon.explorizer.initialize();
     
    }(window.hdemon));

のように行います。

※現在のところ、選択機能、移動・コピー機能は備わっていますが、それらを行った後のコールバックができておらず、任意の処理に繋げることができません。

###メソッドおよび引数


    // 必須のパラメータ
    $wrapper      : jQueryオブジェクト // フォームのサイズ変更および移動範囲を限定するラッパー要素。
                                      // jQueryオブジェクトを指定。
     
    // 任意のパラメータ
    autoScroll    : int // ドラッグ選択時に、強制的にオートスクロールを有効にするか。
                        // 一般的なブラウザでは、この指定に関わらず有効になる。
    scrollWeight  : int // ドラッグ選択時のオートスクロール量
     
    width         : int // 横幅
    height        : int // 縦幅
    minWidth      : int // 最小の横幅
    minHeight     : int // 最小の縦幅
    maxWidth      : int // 最小の横幅
    maxHeight     : int // 最小の縦幅
    tBarHeight    : int // タイトルバーの高さ
    removeBtn     : boolean // 「閉じる」ボタンの有無　※未実装
     
    statusBar     : boolean // ステータスバーの有無　※未実装
    sBarHeight    : int // ステータスバーの高さ　※未実装
     
    // ※以下はすべて未実装。
    callback = {
        manipulated      : handler // 移動・コピー後
        selected         : handler // 選択後
        formRemoved      : handler // フォーム削除後
        formAdded        : handler // フォーム追加後
        onElement        : handler //
        focusChanged     : handler // 特定のフォームをクリックし、フォームの重なりを変化させた後
        focusKeeped      : handler // 特定のフォームをクリックしたが、すでに最前面だった時
        resizingStart    : handler // リサイズ開始時
        resizing         : handler // リサイズ中
        resizingEnded    : handler // リサイズ終了、マウスボタンを離した時。
    }

