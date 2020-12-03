class AvalancheDangerColor {
    static addGradients(svg) {
        const gradients = svg.append('defs')
            .selectAll('linearGradient')
            .data(AvalancheDangerColor.GRADIENTS)
            .join("linearGradient")
            .attr("id", (d) => d)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%");

        gradients.append("stop")
            .attr("offset", "0%")
            .attr("class", (d) => `uac-${d.split('-')[1]}`);

        gradients.append("stop")
            .attr("offset", "100%")
            .attr("class", (d) => `uac-${d.split('-')[2]}`);
    }

    static colorForId(id) {
        try {
            return AvalancheDangerColor.ALL[id]
        } catch {
            throw `Invalid rose petal color value: ${id}`;
        }
    }
}

AvalancheDangerColor.LOW = '#00c346';
AvalancheDangerColor.MODERATE = '#fcfc00';
AvalancheDangerColor.CONSIDERATE = '#ff9100';
AvalancheDangerColor.HIGH = '#cc332c';
AvalancheDangerColor.EXTREME = '#222222';
AvalancheDangerColor.ALL = [
    null,
    AvalancheDangerColor.LOW,
    AvalancheDangerColor.MODERATE,
    AvalancheDangerColor.CONSIDERATE,
    AvalancheDangerColor.HIGH,
    AvalancheDangerColor.EXTREME,
];
// Matches above and maps color to a level description
AvalancheDangerColor.LEVELS = [
    null,
    'low',
    'moderate',
    'considerate',
    'high',
    'extreme'
];
AvalancheDangerColor.GRADIENTS = [
    'uac-moderate-low',
    'uac-considerate-moderate',
    'uac-considerate-low',
    'uac-high-considerate',
    'uac-high-moderate',
    'uac-high-low',
    'uac-extreme-high',
    'uac-extreme-considerate',
    'uac-extreme-moderate',
    'uac-extreme-low',
];
