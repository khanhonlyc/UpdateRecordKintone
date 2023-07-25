(function () {
    "use strict";
    kintone.events.on([
        'app.record.create.submit.success'
    ], function (event) {
        console.log(event)
        var arrtable = []
        event.record.商品情報.value.map((items) => {
            arrtable.push(
                {
                    顧客ID: {
                        value: event.record.顧客ID.value
                    },
                    顧客名: {
                        value: event.record.顧客名.value
                    },
                    注文日: {
                        value: event.record.注文日.value
                    },
                    商品名: {
                        value: items.value.商品名.value
                    },
                    数量: {
                        value: items.value.数量.value
                    },
                    単価: {
                        value: items.value.単価.value
                    },
                    金額: {
                        value: items.value.金額.value
                    },
                    注文ID: {
                        value: event.record.注文ID.value
                    },
                    注文書_TableID: {
                        value: items.id
                    }
                },
            )
        })
        const body = {
            app: 2266,
            records: arrtable
        };
        kintone.api(kintone.api.url('/k/v1/records.json', true), 'POST', body);
        return event;
    });
    var arrevent = [];
    kintone.events.on([
        'app.record.edit.show',
    ], function (event) {
        arrevent.length === 0 ? arrevent.push(event.record) : arrevent[0] = event.record;
    })

    kintone.events.on([
        'app.record.edit.submit.success',
    ], async function (event) {

        const body1 = {
            app: 2266,
        };
        var res = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', body1);
        var filterid = res.records.filter(items => items.注文ID.value === event.record.注文ID.value)

        function compareArrays(sourceArray, targetArray) {
            const sourceIds = sourceArray.map(record => record.id);
            const targetIds = targetArray.map(record => record.id);

            const recordsToAdd = sourceArray.filter(record => !targetIds.includes(record.id));
            const recordsToDelete = targetArray.filter(record => !sourceIds.includes(record.id));

            return {
                recordsToAdd,
                recordsToDelete
            };
        }
        var { recordsToAdd, recordsToDelete } = compareArrays(event.record.商品情報.value, arrevent[0].商品情報.value);
        async function copyDataToTargetApp(recordsToAdd) {
            const arradd = [];
            const recordData = recordsToAdd.map(record => {
                arradd.push({
                    顧客ID: {
                        value: event.record.顧客ID.value
                    },
                    顧客名: {
                        value: event.record.顧客名.value
                    },
                    注文日: {
                        value: event.record.注文日.value
                    },
                    商品名: {
                        value: record.value.商品名.value
                    },
                    数量: {
                        value: record.value.数量.value
                    },
                    単価: {
                        value: record.value.単価.value
                    },
                    金額: {
                        value: record.value.金額.value
                    },
                    注文ID: {
                        value: event.record.注文ID.value
                    },
                    注文書_TableID: {
                        value: record.id
                    }
                });
            });
            const body = {
                app: 2266,
                records: arradd
            };
            var addRecordsResponse = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'POST', body);
            return addRecordsResponse;
        }
        async function deleteDataFromTargetApp(recordsToDelete) {
            var arrdelete = []
            recordsToDelete.forEach(recordelete => {
                filterid.forEach(recordfilter => {
                    if (recordelete.id === recordfilter.注文書_TableID.value) {
                        arrdelete.push(recordfilter.$id.value)
                    }
                })
            })
            const body = {
                app: 2266,
                ids: arrdelete
            };
            var deleteRecordsResponse = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'DELETE', body);
            return deleteRecordsResponse;
        }
        if (recordsToAdd.length > 0) {
            copyDataToTargetApp(recordsToAdd);
        }
        else if (recordsToDelete.length > 0) {
            deleteDataFromTargetApp(recordsToDelete);
        }
        else {
            var updatearr = []
            for (var i in event.record.商品情報.value) {
                for (var y in filterid) {
                    if (event.record.商品情報.value[i].id === filterid[y].注文書_TableID.value) {
                        updatearr.push(
                            {
                                id: filterid[y].$id.value,
                                record: {
                                    商品名: {
                                        value: event.record.商品情報.value[i].value.商品名.value
                                    },
                                    数量: {
                                        value: event.record.商品情報.value[i].value.数量.value
                                    },
                                    単価: {
                                        value: event.record.商品情報.value[i].value.単価.value
                                    },
                                    金額: {
                                        value: event.record.商品情報.value[i].value.金額.value
                                    },
                                }
                            },
                        )
                    }
                }
            }
            const body = {
                app: 2266,
                records: updatearr
            };

            await kintone.api(kintone.api.url('/k/v1/records.json', true), 'PUT', body);

        }
        if (event.record.注文日.value !== arrevent[0].注文日.value ||
            event.record.顧客ID.value !== arrevent[0].顧客ID.value
        ){
            var update = []
            filterid.map(items => {
                update.push(
                    {
                        id: items.$id.value,
                        record: {
                            注文日: {
                                value: event.record.注文日.value
                            },
                            顧客ID: {
                                value: event.record.顧客ID.value
                            },
                            顧客名: {
                                value: event.record.顧客名.value
                            },
                        }
                    }
                )
            })
            const body = {
                app: 2266,
                records: update
            };

            await kintone.api(kintone.api.url('/k/v1/records.json', true), 'PUT', body);
        }

        return event;
    });

    kintone.events.on([
        'app.record.index.delete.submit',
        'app.record.detail.delete.submit',
    ], async function (event) {
        const body = {
            app: 2266
        };
        const res = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', body);
        for (var i in res.records) {
            if (res.records[i].注文ID.value === event.record.注文ID.value) {
                const body = {
                    app: 2266,
                    ids: [res.records[i].$id.value]
                };
                await kintone.api(kintone.api.url('/k/v1/records.json', true), 'DELETE', body);

            }
        }
    });
})();
