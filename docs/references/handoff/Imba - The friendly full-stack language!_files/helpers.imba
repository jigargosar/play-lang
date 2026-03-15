import { styles as imba_styles, createElement as imba_createElement, getRenderContext as imba_getRenderContext, mount as imba_mount, commit as imba_commit } from "https://unpkg.com/imba@2.0.0-alpha.243/dist/imba.mjs";
var $3 = Symbol(), $7 = Symbol(), $9 = Symbol(), $10 = Symbol(), $12 = Symbol(), $14 = Symbol(), $15 = Symbol();
const $$up$ = Symbol.for("##up"), $placeChild$ = Symbol.for("#placeChild");
globalThis.$show = function(text, item) {
  var $1, $2 = imba_getRenderContext(), $4, $5, $6, $8, $11, $13;
  return imba_mount((() => {
    ($4 = $5 = 1, $1 = $2[$3]) || ($4 = $5 = 0, $1 = $2[$3] = $1 = imba_createElement("dl", null, "z19bnwo0-af", null));
    $4 || ($1[$$up$] = $2._);
    ($6 = $1[$7]) || ($1[$7] = $6 = imba_createElement("dt", $1, "z19bnwo0-ag", null));
    $8 = text, $8 === $1[$10] && $4 || ($1[$9] = $6[$placeChild$]($1[$10] = $8, 384, $1[$9]));
    ;
    ($11 = $1[$12]) || ($1[$12] = $11 = imba_createElement("dd", $1, null, null));
    $13 = item, $13 === $1[$15] && $4 || ($1[$14] = $11[$placeChild$]($1[$15] = $13, 384, $1[$14]));
    ;
    return $1;
    ;
  })());
};
globalThis.$log = function(desc, value) {
  console.info(desc);
  return console.log(value);
};
globalThis.$commit = function(flag) {
  return imba_commit();
};
imba_styles.register("z19bnwo0", ".z19bnwo0-af:not(#_):not(#_):not(#_) {padding: 1rem;\npadding-bottom: 0rem;\njustify-self: start;}\n\n.z19bnwo0-ag:not(#_):not(#_):not(#_) {color: hsla(240.00,3.83%,46.08%,100%);\nfont-size: 14px;\nline-height: 22px;\n--u_lh: 22px;}");
