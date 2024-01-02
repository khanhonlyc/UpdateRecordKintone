(function () {
    'use strict';
    var id203 = 203;
    kintone.events.on(['app.record.create.show', 'app.record.edit.show', 'app.record.index.edit.show', 'app.record.detail.show'], function (event) {
        kintone.app.record.setFieldShown('ID_APP_203', false);
        event.record.ID_APP_203.disabled = true;
        return event;
    })
    kintone.events.on('app.record.index.show', function (event) {
        var script = document.createElement('script');
        script.type = 'application/javascript';
        script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
        document.head.appendChild(script);
        
        var loadingElement = document.createElement("div");
        loadingElement.className = "overlay";
        var spinner = document.createElement("div");
        spinner.className = "spinner";
        loadingElement.appendChild(spinner);
        document.body.appendChild(loadingElement);
        loadingElement.style.display = "none";

        document.getElementById("btn-totalling").onclick = async function () {
            const inputvalue = await Swal.fire({
                title: '仕入年月',
                html:
                    '<label for="Date">仕入年月</label>' +
                    '<input type="text" id="Date" class="swal2-input" placeholder="YYYYMM形式">',
                focusConfirm: false,
                preConfirm: () => {
                    let valueInput = document.getElementById('Date').value;
                    let checkInput = /^\d{6}$/.test(valueInput);
                    if (!checkInput) {
                        return Swal.showValidationMessage('YYYYMM形式に従って値を入力してください。');
                    }
                    else {
                        return valueInput;
                    }
                },
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'OK',
            });
            if (inputvalue.value) {
                var YYYY = inputvalue.value.slice(0, 4);
                var MM = inputvalue.value.slice(4, 6);
                var lastDate = new Date(YYYY, MM, 0);
                var startDate = YYYY + "-" + MM + "-" + "01";
                var endDate = YYYY + "-" + MM + "-" + lastDate.getDate();
                console.log(event)
                console.log(startDate, endDate)
                loadingElement.style.display = "block";
                try {
                    var res203 = await fetch(id203, `仕入日 >= "${startDate}" and 仕入日 <= "${endDate}"`);
                    if (res203.length) {
                        var res529 = await fetch(kintone.app.getId());
                        var arrcreate = [];
                        var arrupdate = [];
                        res203.forEach(element => {
                            var find529 = res529.find(item => item.ID_APP_203.value && (item.ID_APP_203.value == element.$id.value));
                            var item = createItem(element);
                            if (find529) {
                                arrupdate.push({
                                    id: find529.$id.value,
                                    record: item
                                })
                            }
                            else {
                                arrcreate.push(item);
                            }
                        });
                        if (arrcreate.length > 0) {
                            await chunkArrayInGroups(arrcreate, 100).reduce(async (promise, arr) => {
                                await promise;
                                const body = {
                                    app: kintone.app.getId(),
                                    records: arr
                                };
                                console.log("bodypost", body)
                                var repsPost = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'POST', body);
                            }, Promise.resolve());
                        }
                        if (arrupdate.length > 0) {
                            await chunkArrayInGroups(arrupdate, 100).reduce(async (promise, arr) => {
                                await promise;
                                const body = {
                                    app: kintone.app.getId(),
                                    records: arr
                                };
                                console.log("bodyput", body)
                                await kintone.api(kintone.api.url('/k/v1/records.json', true), 'PUT', body);
                            }, Promise.resolve());
                        }
                        loadingElement.style.display = "none";
                        location.reload();
                    }
                    else {
                        alert("入力したデータが存在していません。");
                        loadingElement.style.display = "none";
                    }
                } catch (error) {
                    console.log(error)
                    loadingElement.style.display = "none";
                }

            }
        }
    });
    function fetch(app_id, opt_query, opt_offset, opt_records) {
        var offset = opt_offset || 0;
        var records = opt_records || [];
        var query = opt_query || '';
        var id = app_id || kintone.app.getId();
        var params = {
            app: id,
            query: query + 'order by 仕入日 asc limit 500 offset ' + offset
        };
        return kintone.api('/k/v1/records', 'GET', params).then(function (resp) {
            records = records.concat(resp.records);
            if (resp.records.length === 500) {

                return fetch(id, query, offset + 500, records);
            }
            return records;
        });
    }
    function chunkArrayInGroups(arr, size) {
        var newArr = [];
        for (var i = 0; i < arr.length; i += size) {
            newArr.push(arr.slice(i, i + size));
        }
        return newArr;
    }
    function createItem(element) {
        return {
            "仕入科目": { //仕入科目
                "type": "NUMBER",
                "value": element.仕入科目.value
            },
            "伝票区分": { //伝票区分
                "type": "NUMBER",
                "value": element.伝票区分.value
            },
            "仕入日": { //仕入日
                "type": "DATE",
                "value": element.仕入日.value
            },
            "精算日": { //精算日
                "type": "DATE",
                "value": element.精算日.value
            },
            "伝票No": { //伝票No
                "type": "SINGLE_LINE_TEXT",
                "value": element.伝票No.value
            },
            "注文No": { //注文No
                "type": "SINGLE_LINE_TEXT",
                "value": element.注文No.value
            },
            "伝票No2": { //伝票No2
                "type": "SINGLE_LINE_TEXT",
                "value": element.伝票No2.value
            },
            "仕入先コード": { //仕入先コード
                "type": "SINGLE_LINE_TEXT",
                "value": element.仕入先コード.value
            },
            "仕入先名": { //仕入先名
                "type": "SINGLE_LINE_TEXT",
                "value": element.仕入先名.value
            },
            "住所1": { //住所1
                "type": "SINGLE_LINE_TEXT",
                "value": element.住所1.value
            },
            "住所2": { //住所2
                "type": "SINGLE_LINE_TEXT",
                "value": element.住所2.value
            },
            "会社TEL": { //会社TEL
                "type": "SINGLE_LINE_TEXT",
                "value": element.会社TEL.value
            },
            "会社FAX": { //会社FAX
                "type": "SINGLE_LINE_TEXT",
                "value": element.会社FAX.value
            },
            "部門コード": { //部門コード
                "type": "SINGLE_LINE_TEXT",
                "value": element.部門コード.value
            },
            "税率": { //税率
                "type": "NUMBER",
                "value": element.税率.value
            },
            "税抜合計": { //税抜合計
                "type": "CALC",
                "value": element.税抜合計.value
            },
            "外税T_消費税額合計": { //外税T_消費税額合計
                "type": "CALC",
                "value": element.外税T_消費税額合計.value
            },
            "内税": { //内税
                "type": "NUMBER",
                "value": element.内税.value
            },
            "税込合計": {  //税込合計
                "type": "CALC",
                "value": element.税込合計.value
            },
            "ID_PCA": { //ID_PCA
                "type": "NUMBER",
                "value": element.ID_PCA.value
            },
            "受注No_PCA": { //受注No_PCA
                "type": "NUMBER",
                "value": element.受注No_PCA.value
            },
            "受注No_mimosa": { //受注No_mimosa
                "type": "NUMBER",
                "value": element.受注No_mimosa.value
            },
            "ID_PCA_発注": { //ID_PCA_発注
                "type": "NUMBER",
                "value": element.ID_PCA_発注.value
            },
            "ID_APP_203": {
                "type": "NUMBER",
                "value": element.$id.value
            },
            "仕入商品一覧": {
                "type": "SUBTABLE",
                "value": tablecreate(element.仕入商品一覧.value)
            }
        }
    }
    function tablecreate(element) {
        var arrTable = [];
        element.forEach(itemTable => {
            arrTable.push({
                "value": {
                    "商品コード_JANコード": { //商品コード_JANコード
                        "type": "SINGLE_LINE_TEXT",
                        "value": itemTable.value.商品コード_JANコード.value
                    },
                    "商品名": { //商品名
                        "type": "SINGLE_LINE_TEXT",
                        "value": itemTable.value.商品名.value
                    },
                    "自社倉庫コード": { //自社倉庫コード
                        "type": "SINGLE_LINE_TEXT",
                        "value": itemTable.value.自社倉庫コード.value
                    },
                    "入庫済数": { //入庫済数
                        "type": "NUMBER",
                        "value": itemTable.value.入庫済数.value
                    },
                    "箱数": { //箱数
                        "type": "NUMBER",
                        "value": itemTable.value.箱数.value
                    },
                    "区分": {//区分
                        "type": "NUMBER",
                        "value": itemTable.value.区分.value
                    },
                    "数量": { //数量
                        "type": "NUMBER",
                        "value": itemTable.value.数量.value
                    },
                    "単位": { //単位
                        "type": "SINGLE_LINE_TEXT",
                        "value": itemTable.value.単位.value
                    },
                    "単価": { //単価
                        "type": "NUMBER",
                        "value": itemTable.value.単価.value
                    },
                    "金額": { //金額
                        "type": "CALC",
                        "value": itemTable.value.金額.value
                    },
                    "備考": { //備考
                        "type": "SINGLE_LINE_TEXT",
                        "value": itemTable.value.備考.value
                    },
                    "倉庫エリアコード": { //倉庫エリアコード
                        "type": "SINGLE_LINE_TEXT",
                        "value": itemTable.value.倉庫エリアコード.value
                    },
                    "入数": { //入数
                        "type": "NUMBER",
                        "value": itemTable.value.入数.value
                    },
                    "入庫日": { //入庫日
                        "type": "DATE",
                        "value": itemTable.value.入庫日.value
                    },
                    "商品区分１コード": { //商品区分１コード
                        "type": "SINGLE_LINE_TEXT",
                        "value": itemTable.value.商品区分１コード.value
                    }
                }
            })
        })
        return arrTable;
    }

})();
