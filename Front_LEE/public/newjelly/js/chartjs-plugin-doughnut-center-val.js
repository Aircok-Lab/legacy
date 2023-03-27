 // https://stackoverflow.com/questions/20966817/how-to-add-text-inside-the-doughnut-chart-using-chart-js
Chart.pluginService.register({
    beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
            //Get ctx from string
            var ctx = chart.chart.ctx;

            //Get options from the center object in options
            var centerConfig = chart.config.options.elements.center;
            var fontStyle = centerConfig.fontStyle || 'Arial';
            var txt = centerConfig.text;
            var color = centerConfig.color || '#000';
            var sidePadding = centerConfig.sidePadding || 20;
            var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)

            /*********** custom ***********/
            // fontSize: 센터 값 크기: 30~50 : default: 30
            var fontSize = centerConfig.fontSize || "100";
            
            //only support half doughnt chart
            var txtSupport = centerConfig.textSupport || '';
            /*********** custom ***********/
            
            //Start with a base font of 30px
            ctx.font = fontSize + "px " + fontStyle;

            //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
            var stringWidth = ctx.measureText(txt).width;
            var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

            // Find out how much the font can grow in width.
            var widthRatio = elementWidth / stringWidth;
            var newFontSize = Math.floor(30 * widthRatio);    
            var elementHeight = (chart.innerRadius * 2);

            // Pick a new font size so it will not be larger than the height of label.
            var fontSizeToUse = Math.min(newFontSize, elementHeight);

            //Set font settings to draw it correctly.
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            var centerY = txtSupport ? ((chart.chartArea.top + chart.chartArea.bottom) / 2) + ((chart.chartArea.top + chart.chartArea.bottom) / 4) : ((chart.chartArea.top + chart.chartArea.bottom) / 2);
            ctx.font = fontSizeToUse + "px " + fontStyle;
            ctx.fillStyle = color;

            //Draw text in center
            if ( txtSupport != '' ) {
                ctx.fillText(txt, centerX, centerY - fontSizeToUse / 2 );
                ctx.fillText(txtSupport, centerX, centerY + fontSizeToUse / 2 );
            } else {
                ctx.fillText(txt, centerX, centerY );
            }
        }
    }
});