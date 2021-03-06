var CSS;
function loadfixtures() {
    CSS =  "body\
    {\
    font-size:70%;\
    color:#000000;\
    background-color:#f1f1ed;\
    margin:0px;\
    overflow:auto;\
    }\
    \
    body,p,h1,h2,h3,h4,table,td,th,ul,ol,textarea,input\
    {\
    font-family:verdana,helvetica,arial,sans-serif;\
    }\
    \
    h1 {font-size:200%;margin-top:0px;font-weight:normal}\
    h2 {font-size:160%;margin-top:10px;margin-bottom:10px;font-weight:normal}\
    h3 {font-size:120%;font-weight:normal}\
    h4 {font-size:100%;}\
    h5 {font-size:90%;}\
    h6 {font-size:80%;}\
    \
    h1,h2,h3,h4,h5,h6\
    {\
    background-color:transparent;\
    color:#000000;\
    }\
    \
    iframe {margin:0px;}\
    div {width:100%;}\
    \
    table,th,td,input,textarea\
    {\
    font-size:100%;\
    }\
    \
    table.example\
    {\
    color:#000000;\
    background-color:#e5eecc;\
    padding-top:8px;\
    padding-bottom:8px;\
    padding-left:10px;\
    padding-right:10px;\
    border:1px solid #d4d4d4;\
    background-image:url('images/bgfadegreen.gif');\
    background-repeat:repeat-x;\
    }\
    \
    table.example_code\
    {\
    background-color:#ffffff;\
    padding:4px;\
    border:1px solid #d4d4d4;\
    }\
    \
    table.example_code td\
    {\
    font-size:110%;\
    font-family:courier new;\
    }\
    \
    table.code\
    {\
    outline:1px solid #d4d4d4;\
    border:5px solid #e5eecc;\
    }\
    table.code td\
    {\
    font-size:110%;\
    font-family:courier new;\
    background-color:#FFFFFF;\
    border:1px solid #d4d4d4;\
    padding:4px;\
    }\
    table.example_code p,table.code p \
    {\
    font-family:courier new;\
    }\
    \
    table.lamp\
    {\
    width:100%;\
    padding:0px;\
    border:1px solid #d4d4d4;\
    border-collapse:collapse;\
    }\
    \
    table.lamp th\
    {\
    color:#000000;\
    background-color:white;\
    padding:0px;\
    border-right:1px solid #d4d4d4;\
    }\
    \
    table.lamp td\
    {\
    color:#000000;\
    background-color:#e5eecc;\
    padding:4px;\
    padding-left:10px;\
    background-image:url('images/bgfadegreen.gif');\
    background-repeat:repeat-x;\
    }\
    \
    table.reference\
    {\
    border:1px solid #c3c3c3;\
    border-collapse:collapse;\
    }\
    \
    table.reference th\
    {\
    background-color:#e5eecc;\
    border:1px solid #c3c3c3;\
    padding:3px;\
    vertical-align:top;\
    }\
    \
    table.reference td \
    {\
    border:1px solid #c3c3c3;\
    padding:3px;\
    vertical-align:top;\
    }\
    \
    table.intro\
    {\
    padding:5px;padding-left:0px;\
    font-size:110%;\
    color:#555555;\
    background-color:transparent;\
    }\
    \
    table.summary\
    {\
    border:1px solid #d4d4d4;\
    padding:5px;\
    font-size:100%;\
    color:#555555;\
    background-color:#fafad2;\
    }\
    \
    h2.example,h2.example_head\
    {\
    color:#617f10;\
    background-color:transparent;\
    margin-top:0px;\
    }\
    \
    h2.example {font-size:120%;}\
    h2.example_head {font-size:140%;}\
    \
    h2.home\
    {\
    margin-top:0px;\
    margin-bottom:5px;\
    font-size:120%;\
    padding-top:1px;\
    padding-bottom:1px;\
    padding-left:1px;\
    color:#900B09;\
    background-color:#ffffff;\
    }\
    \
    h2.tutheader\
    {\
    margin:0px;\
    padding-top:2px;\
    padding-bottom:2px;\
    padding-left:4px;\
    color:#303030;\
    border:1px solid #d4d4d4;\
    background-image:url('/images/tabletop_gradient.gif');\
    background-repeat:repeat-x;\
    background-color:#ffffff;\
    }\
    \
    h2.left\
    {\
    color:#404040;\
    background-color:#ffffff;\
    font-size:110%;\
    margin-bottom:4px;\
    padding-bottom:0px;\
    margin-top:0px;\
    padding-top:0px;\
    font-weight:bold;\
    }\
    \
    span.marked {color:#e80000;background-color:transparent;}\
    span.deprecated {color:#e80000;background-color:transparent;}\
    \
    p.tutintro\
    {\
    margin-top:0px;\
    font-size:125%;\
    }\
    \
    p.intro\
    {\
    font-size:120%;\
    color:#404040;\
    background-color:transparent;\
    margin-top:10px;\
    }\
    \
    pre\
    {\
    font-family:'courier new';\
    font-size:110%;\
    margin-left:0;\
    margin-bottom:0;\
    }\
    \
    img.float {float:left;}\
    img.navup\
    {\
    vertical-align:middle;\
    height:22px;\
    width:18px;\
    }\
    \
    hr\
    {\
    background-color:#d4d4d4;\
    color:#d4d4d4;\
    height:1px;\
    border:0px;\
    clear:both;\
    }\
    \
    a.example {font-weight:bold}\
    \
    a:link,a:visited {color:#900B09; background-color:transparent}\
    a:hover,a:active {color:#FF0000; background-color:transparent}\
    \
    a.plain:link,a.plain:visited {text-decoration:none;color:#900B09;background-color:transparent}\
    a.plain:hover,a.plain:active {text-decoration:underline;color:#FF0000;background-color:transparent}\
    \
    a.header:link,a.header:visited {text-decoration:none;color:black;background-color:transparent}\
    a.header:hover,a.header:active {text-decoration:underline;color:black;background-color:transparent}\
    \
    table.sitemap a:link,table.sitemap a:visited {text-decoration:none;color:black;background-color:transparent}\
    table.sitemap a:hover,table.sitemap a:active {text-decoration:underline;color:black;background-color:transparent}\
    \
    #leftcolumn a:link,#leftcolumn a:visited {text-decoration:none;color:black;background-color:transparent}\
    #leftcolumn a:hover,#leftcolumn a:active {text-decoration:underline;color:black;background-color:transparent}\
    \
    #rightcolumn a:link,#rightcolumn a:visited {text-decoration:none;color:#900B09;background-color:transparent}\
    #rightcolumn a:hover,#rightcolumn a:active {text-decoration:underline;color:#FF0000;background-color:transparent}\
    \
    .toprect_txt a:link,.toprect_txt a:visited {text-decoration:none;color:#900B09;background-color:transparent}\
    .toprect_txt a:hover,.toprect_txt a:active {text-decoration:underline;color:#FF0000;background-color:transparent}\
    \
    #footer a:link,#footer a:visited {text-decoration:none;color:#909090;background-color:transparent}\
    #footer a:hover,#footer a:active {text-decoration:underline;color:#909090;background-color:transparent}\
    \
    a.m_item:link,a.m_item:visited {text-decoration:none;color:white; background-color:transparent}\
    a.m_item:hover,a.m_item:active {text-decoration:underline;color:white; background-color:transparent}\
    \
    a.chapter:link    {text-decoration:none;color:#98bf21;background-color:transparent}\
    a.chapter:visited {text-decoration:none;color:#98bf21;background-color:transparent}\
    a.chapter:hover   {text-decoration:underline;color:#98bf21;background-color:transparent}\
    a.chapter:active  {text-decoration:none;color:#98bf21;background-color:transparent}\
    \
    a.tryitbtn,a.tryitbtn:link,a.tryitbtn:visited,a.showbtn,a.showbtn:link,a.showbtn:visited\
    {\
    display:block;\
    color:#FFFFFF;\
    background-color:#98bf21;\
    font-weight:bold;\
    font-size:11px;\
    width:120px;\
    text-align:center;\
    padding:0;\
    padding-top:3px;\
    padding-bottom:4px;\
    border:1px solid #ffffff;\
    outline:1px solid #98bf21;\
    text-decoration:none;\
    margin-left:1px;\
    }\
    \
    a.tryitbtn:hover,a.tryitbtn:active,a.showbtn:hover,a.showbtn:active\
    {\
    background-color:#7A991A;\
    }\
    \
    table.chapter \
    {\
    font-size:140%;margin:0px;padding:0px;padding-left:3px;padding-right:3px;\
    }\
    table.chapter td.prev {text-align:left;}\
    table.chapter td.next {text-align:right;}\
    \
    \
    td.blacknav\
    {\
    text-align:center;\
    color:white;\
    background-color:transparent;\
    font-size:10px;\
    font-weight:bold;\
    border-top:1px solid #868686;\
    border-left:1px solid black;\
    border-right:1px solid #868686;\
    padding-bottom:2px;\
    }\
    \
    span.color_h1 {color:#98bf21;}\
    span.left_h2 {color:#617f10;}\
    \
    span.new\
    {\
    float:right;\
    color:#FFFFFF;\
    background-color:#98bf21;\
    font-weight:bold;\
    padding-left:1px;\
    padding-right:1px;\
    border:1px solid #ffffff;\
    outline:1px solid #98bf21;\
    }\
    \
    #rightcolumn table\
    {\
    width:100%;\
    color:#000000;\
    background-image:url('/images/tabletop_gradient.gif');\
    background-repeat:repeat-x;\
    background-color:#ffffff;\
    border-top:1px solid #d4d4d4;\
    margin-bottom:5px;\
    margin-top:0px;\
    }\
    \
    #rightcolumn th\
    {\
    color:#404040;\
    padding-top:3px;\
    padding-bottom:4px;\
    border:1px solid #d4d4d4;\
    border-bottom:none;\
    border-top:none\
    }\
    \
    #rightcolumn td\
    {\
    color:#000000;\
    border:1px solid #d4d4d4;\
    border-top:none;\
    padding-top:3px;\
    padding-bottom:4px;\
    text-align:center;\
    }\
    \
    div.toprect_txt\
    {\
    position:absolute;\
    left:0px;top:0px;\
    width:153px;height:84px;\
    padding:0px;margin:0px;padding-top:4px;\
    border:1px solid #c3c3c3;\
    color:#606060;\
    text-align:center;\
    font-size:11px;\
    }\
    div.toprect_img\
    {\
    position:absolute;\
    left:0px;top:0px;\
    width:155px;height:90px;\
    margin:0px;padding:0px;\
    color:#606060;\
    text-align:center;\
    font-size:11px;\
    }\
    \
    #footer\
    {\
    margin-top:0px;margin-bottom:10px;\
    padding:20px;padding-top:7px;padding-bottom:0px;\
    color:#909090;background-color:transparent;\
    border:1px solid #d3d3d3;border-bottom:none;\
    background-image:url('/images/tabletop_gradient.gif');background-repeat:repeat-x;\
    }\
    \
    .notsupported,.notsupported:hover,.notsupported:active,.notsupported:visited,.notsupported:link\
    {\
    color:rgb(197,128,128)\
    }\
    /* Style for a Candidate Recommendation */\
    \
    /*\
       Copyright 1997-2003 W3C (MIT, ERCIM, Keio). All Rights Reserved.\
       The following software licensing rules apply:\
       http://www.w3.org/Consortium/Legal/copyright-software */\
    \
    /* $Id: base.css,v 1.25 2006/04/18 08:42:53 bbos Exp $ */\
    \
    body {\
      padding: 2em 1em 2em 70px;\
      margin: 0;\
      font-family: sans-serif;\
      color: black;\
      background: white;\
      background-position: top left;\
      background-attachment: fixed;\
      background-repeat: no-repeat;\
    }\
    \
    body {\
    \
    }\
    \
    :link { color: #00C; background: transparent }\
    :visited { color: #609; background: transparent }\
    a:active { color: #C00; background: transparent }\
    \
    a:link img, a:visited img { border-style: none } /* no border on img links */\
    \
    a img { color: white; }        /* trick to hide the border in Netscape 4 */\
    @media all {                   /* hide the next rule from Netscape 4 */\
      a img { color: inherit; }    /* undo the color change above */\
    }\
    \
    th, td { /* ns 4 */\
      font-family: sans-serif;\
    }\
    \
    h1, h2, h3, h4, h5, h6 { text-align: left }\
    /* background should be transparent, but WebTV has a bug */\
    h1, h2, h3 { color: #005A9C; background: white }\
    h1 { font: 170% sans-serif }\
    h2 { font: 140% sans-serif }\
    h3 { font: 120% sans-serif }\
    h4 { font: bold 100% sans-serif }\
    h5 { font: italic 100% sans-serif }\
    h6 { font: small-caps 100% sans-serif }\
    \
    .hide { display: none }\
    \
    div.head { margin-bottom: 1em }\
    div.head h1 { margin-top: 2em; clear: both }\
    div.head table { margin-left: 2em; margin-top: 2em }\
    \
    p.copyright { font-size: small }\
    p.copyright small { font-size: small }\
    \
    @media screen {  /* hide from IE3 */\
    a[href]:hover { background: #ffa }\
    a[href]:active { background: #ffa }\
    }\
    \
    pre { margin-left: 2em }\
    /*\
    p {\
      margin-top: 0.6em;\
      margin-bottom: 0.6em;\
    }\
    */\
    dt, dd { margin-top: 0; margin-bottom: 0 } /* opera 3.50 */\
    dt { font-weight: bold }\
    \
    pre, code { font-family: monospace } /* navigator 4 requires this */\
    \
    ul.toc, ol.toc {\
      list-style: disc;		/* Mac NS has problem with 'none' */\
      list-style: none;\
    }\
    \
    @media aural {  \
      h1, h2, h3 { stress: 20; richness: 90 }\
      .hide { speak: none }\
      p.copyright { volume: x-soft; speech-rate: x-fast }\
      dt { pause-before: 20% }\
      pre { speak-punctuation: code } \
    }\
    \
    \
    \
    body {\
      background-image: url(http://www.w3.org/StyleSheets/TR/logo-CR);\
    }"
}
