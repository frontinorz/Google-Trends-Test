const urltest = 'http://opendata.hccg.gov.tw/dataset/1f334249-9b55-4c42-aec1-5a8a8b5e07ca/resource/4d5edb22-a15e-4097-8635-8e32f7db601a/download/20180619153742850.json';

const app = new Vue({
    el: '#app',
    data: {
        bikedata: [],
        map: {},
        infowindow: {},
        isMarkerCreated: false,
        contentString: `<div><h1>Some text here</h1></div>`,
        inputVal: "",
        inputCheck: true
    },
    created: function () {
        this.datainit();
    },
    mounted: function(){
        this.initmap();
    },
    updated: function () {
        if (!this.isMarkerCreated)this.createMarker(this.bikedata);
    },
    computed:{
        checkinput: function () {
            return this.bikedata.some(station => station.name === this.inputVal);
        }
    },
    methods: {
        datainit: function () {
            let self = this;
            // $.ajax({
            //     url: urltest,
            //     dataType: 'json',
            //     success: function (res) {
            //         self.bikedata = self.datatrans(res);
            //     }
            // });
            $.getJSON("bikedatas.json", function (json) {
                self.bikedata = self.datatrans(json);
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
            console.log("refresh");
            const self = this;
            datas.forEach(data => {
                let lat = data.lat;
                let lng = data.lng;
                let marker = new google.maps.Marker({
                    position: {lat,lng},
                    map: self.map,
                    title: data.name,
                    icon: {
                        url: 'images/bikeLocate.png',
                        scaledSize: new google.maps.Size(60, 60),
                        labelOrigin: new google.maps.Point(30, -10)
                    },
                    label: {
                        text: data.name,
                        color: 'black',
                        fontSize: '1.2rem',
                        fontWeight: 'bold' }
                });
                marker.addListener('click', function () {
                    let html =
                        `<div class="map__info">
                            <div class="map__info__title">${data.name}</div>
                        </div>`;

                    self.infowindow.setContent(html);
                    self.infowindow.open(self.map, marker);
                });
            });
            this.isMarkerCreated = true;
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
                    self.map.setCenter(pos);
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
        },
        setCenter: function (lat,lng) {
            this.map.setCenter({lat, lng});
            this.map.setZoom(18);
            document.getElementById('map').scrollIntoView();
        },
        imageError: function (a) {
            console.log(a);
        },
        searchStation: function () {
            if ($('.input-search').val()){
                let ans = this.bikedata.find(station => station.name === $('.input-search').val());
                this.map.setCenter({
                    lat: ans.lat,
                    lng: ans.lng
                });
                this.map.setZoom(18);
            }
        }
    }
});



