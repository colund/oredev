;jQuery(function life() {
	
	var $      = jQuery,
	    $tbody = $('table tbody'),
		  SIZE   = 25;

	function invert (filter) {
		return function invert ($selection) {
			return $selection
				.not(
					$selection
						.into(filter)
				)
		}
	}
	
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
		
		// filter for live and dead cells
		
		function aliveFilter ($selection) {
			return $selection
				.filter('.alive');
		}
		
		function notAliveFilter ($selection) {
			return $selection
				.filter(':not(.alive)');
		}
		
		// given a middle cell, these functions count
		// whether there are zero, one, or two
		// live cells in the left and right
		
		function leftIsAliveFilter ($selection) {
			return $selection
				.filter('td.alive + td')
		}
		
		function rightIsAliveFilter ($selection) {
			return $selection
				.next('td.alive')
					.prev('td')
		}
		
		function noHorizontalNeighboursFilter ($selection) {
			return $selection
				.into(invert(leftIsAliveFilter))
					.into(invert(rightIsAliveFilter))
		}
		
		function oneHorizontalNeighboursFilter ($selection) {
			return $selection
				.into(invert(leftIsAliveFilter))
					.into(rightIsAliveFilter)
						.add(
							$selection
								.into(leftIsAliveFilter)
									.into(invert(rightIsAliveFilter))
						)
		}
		
		function twoHorizontalNeighboursFilter ($selection) {
			return $selection
				.into(leftIsAliveFilter)
					.into(rightIsAliveFilter)
		}
		
		// given a selection of 'middle' cells, these functions count how
		// many live cells are in the triplet of left, middle, night
		
		function zeroOutOfThreeFilter ($selection) {
			return $selection
				.into(notAliveFilter)
					.into(noHorizontalNeighboursFilter)
		}
		
		function oneOutOfThreeFilter ($selection) {
			return $selection
				.into(notAliveFilter)
					.into(oneHorizontalNeighboursFilter)
						.add(
							$selection
								.into(aliveFilter)
								.into(noHorizontalNeighboursFilter)
						)
		}
		
		function twoOutOfThreeFilter ($selection) {
			return $selection
				.into(notAliveFilter)
					.into(twoHorizontalNeighboursFilter)
						.add(
							$selection
								.into(aliveFilter)
								.into(oneHorizontalNeighboursFilter)
						)
		}
		
		function threeOutOfThreeFilter ($selection) {
			return $selection
				.into(aliveFilter)
				.into(twoHorizontalNeighboursFilter)
		}
		
		function adjacentTraverse ($selection) {
			return $selection
				.prev()
					.add(
						$selection
							.next()
					)
		}
		
		var cellsInColumnFilter = function (index) {
			return function cellsInColumnFilter ($selection) {
				return $selection
					.filter('td:nth-child('+index+')')
			}
		};
		
		var incrementNeighbourCountBy = function (number) {
			return function incrementNeighbourCountBy ($selection) {
				var i,
				    was,
				    next;
			
				if (number === 0) return;
				
				for (i = 8; i >= 0; i--) {
					was = 'n' + i;
					next = 'n' + (i + number);
					$selection
						.filter('.' + was)
							.removeClass(was)
							.addClass(next)
				}
			}
		};
		
		function cellsThatShouldLiveFilter ($selection) {
			return $selection
				.filter('.n3:not(.alive),.n2.alive,.n3.alive')
		}
		
		$td
			.addClass('n0')
			.tap(function countHorizontalNeighbours ($selection) {
				var horizontalNeighbourFilters = [
							noHorizontalNeighboursFilter,
							oneHorizontalNeighboursFilter,
							twoHorizontalNeighboursFilter
						],
						count;
				
				for (count = 0; count < horizontalNeighbourFilters.length; count++) {
				
					$selection
						.into(horizontalNeighbourFilters[count])
							.tap(incrementNeighbourCountBy(count))
				}
			})
			.tap(function incrementVerticalNeighboursForTriplets ($selection) {
				var tripletFilters = [
					zeroOutOfThreeFilter,
					oneOutOfThreeFilter,
					twoOutOfThreeFilter,
					threeOutOfThreeFilter
				],
				count,
				column_index,
				tripletPopulation;
				
				for (column_index = 1; column_index <= SIZE; column_index++) {
					for (tripletPopulation = 0; tripletPopulation < tripletFilters.length; tripletPopulation++) {
						$selection
							.into(cellsInColumnFilter(column_index))
								.into(tripletFilters[tripletPopulation])
									.parent() // rows with a middle of a triplet in this column
										.each(function (index, row) {
											$(row)
										  	.into(adjacentTraverse) // adjacent rows
										    	.children() // cells in rows adjacent
														.into(cellsInColumnFilter(column_index))
															.tap(incrementNeighbourCountBy(tripletPopulation))
										})
					}
				}
			})
			.into(cellsThatShouldLiveFilter)
				.into(notAliveFilter)
					.addClass('alive', 1000, 'easeInSine')
					.end()
				.end()
			.into(aliveFilter)
				.into(invert(cellsThatShouldLiveFilter))
					.removeClass('alive', 1000, 'easeInSine')
					.end()
				.end()
			.removeClass('n0 n1 n2 n3 n4 n5 n6 n7 n8')
		
	}

});