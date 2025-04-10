import 'package:flutter/material.dart';

class Footer extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onItemTapped;

  const Footer(
      {Key? key, required this.selectedIndex, required this.onItemTapped})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.bottomCenter,
      children: [
        ClipPath(
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              color: const Color.fromARGB(255, 33, 41, 79),
            ),
            height: 80,
            width: 400,
            // Navy blue background
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(Icons.home, 0),
                _buildNavItem(Icons.menu_book, 1),
                _buildNavItem(Icons.group, 2),
                _buildNavItem(Icons.memory, 3),
                _buildNavItem(Icons.category, 4),
              ],
            ),
          ),
        ),
        const SizedBox(
          height: 10,
        ),
      ],
    );
  }

  Widget _buildNavItem(IconData icon, int index) {
    return IconButton(
      icon: Icon(icon,
          color: index == selectedIndex
              ? Color.fromARGB(255, 73, 171, 176)
              : Colors.white),
      onPressed: () => onItemTapped(index),
    );
  }
}

// class NavBarClipper extends CustomClipper<Path> {
//   @override
//   Path getClip(Size size) {
//     double width = size.width;
//     double height = size.height;
//     Path path = Path()
//       ..moveTo(0, height)
//       ..lineTo(width * 0.35, height)
//       ..quadraticBezierTo(width * 0.5, height - 40, width * 0.65, height)
//       ..lineTo(width, height)
//       ..lineTo(width, 0)
//       ..lineTo(0, 0)
//       ..close();
//     return path;
//   }

//   @override
//   bool shouldReclip(CustomClipper<Path> oldClipper) => false;
// }
