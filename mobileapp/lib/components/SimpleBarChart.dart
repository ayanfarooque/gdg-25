import 'package:flutter/material.dart';

class SimpleBarChart extends StatelessWidget {
  final List<BarData> data;
  final double maxValue;
  final Color barColor;
  final Color backgroundColor;
  final double barWidth;
  final double barSpacing;
  final double height;
  
  const SimpleBarChart({
    Key? key,
    required this.data,
    required this.maxValue,
    this.barColor = const Color(0xFF49ABB0),
    this.backgroundColor = Colors.grey,
    this.barWidth = 20,
    this.barSpacing = 12,
    this.height = 200,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: data.map((item) {
          final double percentage = item.value / maxValue;
          
          return Column(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Container(
                width: barWidth,
                height: height * percentage * 0.8,
                decoration: BoxDecoration(
                  color: barColor,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                item.label,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[700],
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }
}

class BarData {
  final String label;
  final double value;
  
  const BarData(this.label, this.value);
}