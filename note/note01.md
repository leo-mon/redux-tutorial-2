## Simplifying the Arrow Function

アロー関数を使う場合、単にシンプルなオブジェクトを返すだけならreturn文を省略可能なケースがある  
Action Createrが今回それに相当し、return文を削除し、代わりに()で囲むことで代用できる  
mapStateToPropsやmapDispathcToPropsも同様に省略できるケースが多い  

またオブジェクト内でアロー関数を定義するときには`:`と`=>`を省略できる

```
onClick: () => {}

onClick() {}  //Standard styleではカッコの前にスペース入れる必要があって怒られる
```

> やりすぎ感あるがひとまずこのまま進む

