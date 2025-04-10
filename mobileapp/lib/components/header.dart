import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Header extends StatelessWidget {
  final VoidCallback onProfileTap;
  final VoidCallback onNotificationTap;
  final String profileImage;
  final String welcomeText;

  const Header({
    super.key,
    required this.onProfileTap,
    required this.onNotificationTap,
    required this.profileImage,
    required this.welcomeText,
  });

  Future<void> _logout(BuildContext context) async {
    try {
      // Show confirmation dialog
      bool confirmLogout = await showDialog(
            context: context,
            builder: (BuildContext context) {
              return AlertDialog(
                title: Text('Confirm Logout'),
                content: Text('Are you sure you want to log out?'),
                actions: <Widget>[
                  TextButton(
                    child: Text('Cancel'),
                    onPressed: () {
                      Navigator.of(context).pop(false);
                    },
                  ),
                  TextButton(
                    child: Text('Logout'),
                    onPressed: () {
                      Navigator.of(context).pop(true);
                    },
                  ),
                ],
              );
            },
          ) ??
          false;

      if (confirmLogout) {
        // Clear the token from SharedPreferences
        final prefs = await SharedPreferences.getInstance();
        await prefs.remove('token');

        // Navigate to login screen and clear navigation stack
        Navigator.of(context)
            .pushNamedAndRemoveUntil('/auth', (route) => false);
      }
    } catch (e) {
      print("Error during logout: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error logging out. Please try again.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(0.0, 70.0, 0.0, 0.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/profile');
                  },
                  style: ElevatedButton.styleFrom(
                    shape: const CircleBorder(),
                    padding: const EdgeInsets.all(2.0),
                    backgroundColor: const Color.fromARGB(26, 33, 41, 79),
                    elevation: 4,
                  ),
                  child: CircleAvatar(
                    radius: 20,
                    backgroundImage: AssetImage('lib/images/image3.png'),
                  ),
                ),
                SizedBox(width: 12),
                Text(
                  welcomeText,
                  style: const TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold),
                ),
                SizedBox(width: 12),
                CircleAvatar(
                  radius: 24,
                  backgroundColor: const Color.fromARGB(26, 33, 41, 79),
                  child: IconButton(
                    icon: const Icon(Icons.notifications),
                    onPressed: onNotificationTap,
                    tooltip: 'Notifications',
                  ),
                ),
                CircleAvatar(
                  radius: 24,
                  backgroundColor: const Color.fromARGB(26, 33, 41, 79),
                  child: IconButton(
                    icon: const Icon(Icons.logout),
                    onPressed: () => _logout(context),
                    tooltip: 'Logout',
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
