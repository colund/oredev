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
			
			function hasAnotherNeighbour ($selection, prefixes) {
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
				$('td.alive')
					.prev('td')
						.tap(hasAnotherNeighbour, 'h,n')
						.end()
					.next('td')
						.tap(hasAnotherNeighbour, 'h,n')
			})();
			
			(function countVerticalAndDiagonalNeightbours () {
				var steps = [
							{ selector: '.h2.alive',                 times: 3 },
							{ selector: '.h1.alive,.h2:not(.alive)', times: 2   },
							{ selector: '.h0.alive,.h1:not(.alive)', times: 1     }
				    ],
				    column;
				
				function timesDo ($selection, times, fn) {
					var count;
					
					for (count = 0; count < times; count++) {
						$selection
							.into(fn);
					}
				}
				
				function en ($selection) {
					$selection
						.into(hasAnotherNeighbour, 'n')
				}
				
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
						    
						$prevs
							.tap(timesDo, step.times, en)
						$nexts
							.tap(timesDo, step.times, en)
						
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