const data = [
    {
        "站點名稱": "新竹火車站(前站)",
        "經度": "120.971459",
        "緯度": "24.801815",
        "圖片URL": "http://opendata-manage.hccg.gov.tw/img/24/youbike01.jpg",
        "站點位置": "中華路二段445號(火車站前廣場)",
        "車柱數": "52"
    },
    {
        "站點名稱": "東門圓環",
        "經度": "120.970556",
        "緯度": "24.803866",
        "圖片URL": "http://opendata-manage.hccg.gov.tw/img/24/youbike02.jpg",
        "站點位置": "勝利路2號(對面圓環人行道)",
        "車柱數": "16"
    },
    {
        "站點名稱": "新竹市政府",
        "經度": "120.969260",
        "緯度": "24.806138",
        "圖片URL": "http://opendata-manage.hccg.gov.tw/img/24/youbike03.jpg",
        "站點位置": "中央路106號(對面人行道)",
        "車柱數": "20"
    },
    {
        "站點名稱": "明志書院立體停車場",
        "經度": "120.965760",
        "緯度": "24.801670",
        "圖片URL": "http://opendata-manage.hccg.gov.tw/img/24/youbike04.jpg",
        "站點位置": "西大路317號(停車場前人行道)",
        "車柱數": "23"
    }
];
const urltest = 'http://opendata.hccg.gov.tw/dataset/1f334249-9b55-4c42-aec1-5a8a8b5e07ca/resource/4d5edb22-a15e-4097-8635-8e32f7db601a/download/20180619153742850.json';

const app = new Vue({
    el: '#app',
    data: {
        bikedata: [
            {
                name: 'loading'
            }
        ]
    },
    created: function () {
        this.datainit();
    },
    methods: {
        datainit: function () {
            let self = this;
            $.ajax({
                url: urltest,
                dataType: 'json',
                success: function (res) {
                    self.bikedata = self.datatrans(res);
                }
            });
        },
        datatrans: function (data) {
            return data.map(data => {
                return data = {
                    name: data.站點名稱,
                    lat: data.緯度,
                    lng: data.經度,
                    imgurl: data.圖片URL,
                    position: data.站點位置,
                    bikenum: data.車柱數
                };
            });
        }
    }
});



