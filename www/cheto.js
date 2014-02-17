(function(){
	var Cheto = {
		add: function (ip) {
			$(".devices-list").append(
    			'<a href="#" class="list-group-item">'
    			+ '<span class="device-item" data-ip="' + ip + '">' + ip + '</span>'
    			+ '<span class="remove-device pull-right badge label-danger">x</span>'
    			+ '</a>'
    		);
    		$(".devices-list").find("span[data-ip='" + ip + "']").click();
		},

		save: function () {
			var db = chrome.storage.local,
				ips = [];

			$(".device-item").each(function (k, el) {
        		ips.push($(el).data('ip'));
        	});

        	db.set({'cheto.ping': ips});
		},

		load: function () {
			var that = this,
				db = chrome.storage.local;

			db.get('cheto.ping', function (result) {
				if (result) {
					$.each(result, function (k, v) {
						that.add(v);
					});
				} else {
					that.add('127.0.0.1');
					that.add('localhost');
					that.save();
				}
			});
		},

		init: function(params) {
            var that = this,
            	ping_interval = 5 * 60 * 1000;

            this.load();

            $(document).on('click', '.add-device', function (e) {
            	var ip = $(".new-device").val();
            	console.log(ip);
            	if (ip) {
            		that.add(ip);
            		that.save();
            		$(".new-device").val("");
            	}
            });

            $(document).on('click', '.remove-device', function (e) {
            	$(e.target).parent().remove();
            	that.save();
            });

            $(document).on('click', '.device-item', function (e) {
				var $this = $(e.target);
					ip = $this.data('ip');
				//e.preventDefault();
				console.log(ip);
				
				$this.html('<span class="label label-info">&hellip;</span> ' + ip);

				$.Ping("http://" + ip /*, optional timeout */).done(function (success, url, time, on) {
					//console.log("ping done", arguments);
					$this.html('<span class="label label-success">+</span> ' + ip);
				}).fail(function (failure, url, time, on) {
					//console.log("ping fail", arguments);
					$this.html('<span class="label label-danger">&middot;</span> ' + ip);
				});
				return false;
			});

            $(document).on('click', '.ping-all', function (e) {
            	$(".device-item").each(function (k, el) {
            		var $this = $(el),
            			ip = $this.data('ip');
						
					$this.html('<span class="label label-info">&hellip;</span> ' + ip);

					$.Ping("http://" + ip /*, optional timeout */).done(function (success, url, time, on) {
						console.log("ping done", arguments);
						$this.html('<span class="label label-success">+</span> ' + ip);
					}).fail(function (failure, url, time, on) {
						console.log("ping fail", arguments);
						$this.html('<span class="label label-danger">&middot;</span> ' + ip);
					});
            	});
            });

            window.setInterval(function (e) {
            	$(".device-item").each(function (k, el) {
            		var $this = $(el),
            			ip = $this.data('ip');
						
					$this.html('<span class="label label-info">&hellip;</span> ' + ip);

					$.Ping("http://" + ip /*, optional timeout */).done(function (success, url, time, on) {
						//console.log("ping done", arguments);
						$this.html('<span class="label label-success">+</span> ' + ip);
					}).fail(function (failure, url, time, on) {
						//console.log("ping fail", arguments);
						$this.html('<span class="label label-danger">&middot;</span> ' + ip);
					});
            	});
            }, ping_interval);
        }
	}

	Cheto.init();
    this.Cheto = Cheto;
}).call(this);
