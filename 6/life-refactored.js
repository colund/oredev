;jQuery(function life() {
	
	var $      = jQuery,
	    $tbody = $('table tbody'),
		  SIZE   = 25;
	
	(function buildLifeUniverse () {
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
	})();
	
	(function bindEventHandlers () {
		$tbody
			.on('click', 'td', function (event) {
				if (event.metaKey) {
					$(event.currentTarget)
						.toggleClass("alive")
				}
				else iterate()
			})
	})();
	
	///
	
	function iterate () {
		var $td = $('td'),
		    $tr,
		    $alive;
		
		function incrementNeighbourCountBy ($selection, prefixes, number) {
			var i,
			    $was;
			
			number || (number = 1)
			
			if ($selection.size()) {
				
				prefixes.split(',').forEach(function (prefix) {
					for (i = 8; i >= 0; i--) {
						var was = prefix + i,
						    next = prefix + (i + number);
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
					.tap(incrementNeighbourCountBy, 'h,n')
					.end()
				.next('td')
					.tap(incrementNeighbourCountBy, 'h,n')
		})();
		
		(function countVerticalAndDiagonalNeightbours () {
			var steps = [
						{ selector: '.h2.alive',                 times: 3 },
						{ selector: '.h1.alive,.h2:not(.alive)', times: 2   },
						{ selector: '.h0.alive,.h1:not(.alive)', times: 1     }
			    ],
			    column;
			
			for (column = 0; column < SIZE; column++) {
				steps.forEach(function (step) {
					var $rows = $('td:nth-child('+column+')')
					      .filter(step.selector)
					        .parent();
					
					function neighbours ($selection) {
						$selection
							.tap(incrementNeighbourCountBy, 'n', step.times)
					}
					
					$rows
					  .prev('tr')
					    .children('td:nth-child('+column+')')
								.tap(neighbours)
								.end()
							.end()
					  .next('tr')
					    .children('td:nth-child('+column+')')
								.tap(neighbours)
					
				})
				$rows = $('tr ')
			}
		})();
		
		///
		
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

});