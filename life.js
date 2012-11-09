;jQuery(function () {
	
	(function life($, undefined) {
			var SIZE = 25,
			    $tbody = $('body tbody');
		
		(function initialize () {
			var i,
					j,
					$td,
					$tr;
	
			for (i = 0; i < SIZE; i++) {
				$tr = $('<tr></tr>');
				for (j = 0; j < SIZE; j++) {
					$('<td></td>')
						.appendTo($tr)
				}
				$tbody.append($tr)
			}
			
			$('td')
				.click(function (event) {
					if (event.metaKey) {
						$(event.currentTarget)
							.toggleClass("alive")
						event.preventDefault()
					}
				});
				
			$('table')
				.click(function (event) {
					if (!event.metaKey) {
						iterate()
					}
				})
				
		})();
		
		function iterate () {
			var $td = $('td'),
			    $tr,
			    $alive;
			
			function hasAnotherNeighbour (prefixes, $selection) {
				var i,
				    $was;
				
				if ($selection.size()) {
					
					prefixes.split(',').forEach(function (prefix) {
						for (i = 8; i >= 0; i--) {
							var was = prefix + i,
							    next = prefix + (i + 1);
							$was = $selection.filter('.' + was);
						
							$was
								.removeClass(was)
								.addClass(next)
						}
					})
				
				}
				
			}
		
			$td
				.removeClass('h1 h2 n1 n2 n3 n4 n5 n6 n7 n8')
				.addClass('h0 n0');
					
			(function countHorizontallyAdjacentNeighbours () {
				$alive = $('td.alive');
			
				hasAnotherNeighbour('h,n', $alive.prev('td'));
				hasAnotherNeighbour('h,n', $alive.next('td'))
			})();
			
			(function countVerticalAndDiagonalNeightbours () {
				var steps = [
							{ selector: '.h2.alive',                 times: [1,2,3] },
							{ selector: '.h1.alive,.h2:not(.alive)', times: [1,2]   },
							{ selector: '.h0.alive,.h1:not(.alive)', times: [1]     }
				    ],
				    column;
				
				for (column = 0; column < SIZE; column++) {
					steps.forEach(function (step) {
						var $rows = $('td:nth-child('+column+')')
						      .filter(step.selector)
						        .parent(),
						    $prevs = $rows
						               .prev('tr')
						                 .children('td:nth-child('+column+')'),
						    $nexts = $rows
						               .next('tr')
						                 .children('td:nth-child('+column+')');
						    
						step.times.forEach(function () {
							hasAnotherNeighbour('n', $prevs);
							hasAnotherNeighbour('n', $nexts)
						})
						
					})
					$rows = $('tr ')
				}
			})();
			
			(function tng() {
				var nextGeneration = $('.n3:not(.alive),.n2.alive,.n3.alive')
															 .not('.alive')
				                         .addClass('alive', 1000, 'easeInSine')
				                         .end();
				$('.alive')
					.not(nextGeneration)
						.removeClass('alive', 1000, 'easeOutSine');
			})()
			
		}
	
	})(jQuery, void 0)

});