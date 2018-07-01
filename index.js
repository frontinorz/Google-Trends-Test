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
        ],
        map: {},
        infowindow: {},
        contentString: `<div><h1>Some text here</h1></div>`
    },
    created: function () {
        this.datainit();
    },
    mounted: function(){
        this.initmap();
    },
    updated: function () {
        this.createMarker(this.bikedata);
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
                return {
                    name: data.站點名稱,
                    lat: parseFloat(data.緯度),
                    lng: parseFloat(data.經度),
                    imgurl: data.圖片URL,
                    position: data.站點位置,
                    bikenum: data.車柱數
                };
            });
        },
        initmap: function () {
            const self = this;
            let url = {
                lat: 24.7983301,
                lng: 120.9673986
            };
            let options = {
                zoom: 16,
                center: url
            };
            this.map = new google.maps.Map(document.getElementById('map'), options);
            self.infowindow = new google.maps.InfoWindow({
                content : self.contentString,
                maxWidth: 350
            });
        },
        createMarker: function (datas) {
            const self = this;
            datas.forEach(data => {
                let lat = data.lat;
                let lng = data.lng;
                let marker = new google.maps.Marker({
                    position: {lat,lng},
                    map: self.map,
                    title: data.name
                });
                marker.addListener('click', function () {
                    let html =
                        `<div class="map__info">
                            <div class="map__info__title">${data.name}</div>
                        </div>`;

                    self.infowindow.setContent(html);
                    self.infowindow.open(self.map, marker);
                })
            });

        },
        myPosition: function () {
            const self = this;
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition((position)=>{
                    let pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    self.infowindow.setPosition(pos);
                    self.infowindow.setContent('我在這裡!');
                    self.infowindow.open(self.map);
                    //self.map.setCenter(pos);
                }, function () {
                    handleLocationError(true, self.infowindow, self.map.getCenter());
                });
            }else{
                handleLocationError(false, self.infowindow, self.map.getCenter());
            }
            function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(browserHasGeolocation ?
                    'Error: The Geolocation service failed.' :
                    'Error: Your browser doesn\'t support geolocation.');
                infoWindow.open(self.map);
            }
        }
    }
});



