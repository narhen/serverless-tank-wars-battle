module.exports = function (map) {
    'use strict';
    var wallAt = function (point) {
        return map.walls.find(function (wall) {
                return wall.x === point.x && wall.y === point.y;
                });
        },
        enemyAt = function (point) {
            return map.enemies.find(function (tank) {
                    return tank.x === point.x && tank.y === point.y;
                    });
        },
        movements = {
            top: { x: 0, y: -1 },
            left: { x: -1, y: 0 },
            bottom: {x: 0, y: 1},
            right: {x: 1, y: 0}
        },
        outsideMap = function (point) {
            return point.x < 0 || point.x >= map.mapWidth || point.y < 0 || point.y >= map.mapHeight;
        },
        targetInSight = function (firingTank, targetPoint, maxDistance) {
            var distance, pointAtDistance;
            var firingTankMovement = movements[firingTank.direction];

            if (!targetPoint || !targetPoint.x || !firingTank.y) {
                return false;
            }
            for (distance = 0; distance < (maxDistance || map.weaponRange); distance++) {
                pointAtDistance = {
                    x: firingTank.x + (distance + 1) * firingTankMovement.x,
                    y: firingTank.y + (distance + 1) * firingTankMovement.y
                };

                if (targetPoint.x == pointAtDistance.x && targetPoint.y == pointAtDistance.y) {
                    return true;
                }
            }
            return false;
        },
        getChasingAxis = function (chaserTank, targetTank) {
            var vertical, horizontal, verticalDist, horizontalDist;
            if (!hasCoordinates(chaserTank) || !hasCoordinates(targetTank)) {
              return;
            }

            vertical = (chaserTank.y < targetTank.y) ? 'bottom' : 'top';
            horizontal = (chaserTank.x < targetTank.x) ?  'right' : 'left';
            verticalDist = Math.abs(chaserTank.y - targetTank.y);
            horizontalDist = Math.abs(chaserTank.x - targetTank.x);

            if (horizontalDist === 0) {
                return vertical;
            } else if (verticalDist === 0) {
                return horizontal;
            } else if (horizontalDist < verticalDist) {
                return horizontal;
            } else {
                return vertical;
            }
        },
        randomIntInc = function(low, high) {
            return Math.floor(Math.random() * (high - low + 1) + low);
        },
        hasCoordinates = function(p) {
          return p && p.x && p.y
        },
        getDirections = function(srcPoint, destPoint) {
            var res = [];

            if (!hasCoordinates(srcPoint) || !hasCoordinates(destPoint)) {
              return res;
            }

            if (srcPoint.x < destPoint.x) {
                res.push("right");
            } else if (srcPoint.x > destPoint.x) {
                res.push("left");
            } else if (srcPoint.y > destPoint.y) {
                res.push("top");
            } else {
                res.push("bottom");
            }

            return res;
        },
        myTank = map.you,
        opponentTank = (map.enemies && map.enemies[0]) || {},
        meMovement = myTank.direction && movements[myTank.direction],
        opMovement = opponentTank.direction && movements[opponentTank.direction],
        nextFieldOpponent = opMovement && { x: opponentTank.x + opMovement.x, y: opponentTank.y + opMovement.y },
        nextFieldMe = opMovement && { x: myTank.x + meMovement.x, y: myTank.y + meMovement.y };


        var available_commands = ["fire", "pass", "turn-left", "turn-right", "forward", "reverse"];
        var random_command = randomIntInc(0, available_commands.length - 1);

        return available_commands[random_command];
};
