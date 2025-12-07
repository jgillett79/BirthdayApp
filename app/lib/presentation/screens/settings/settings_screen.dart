import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        children: [
          const SizedBox(height: 8),

          // Household section
          _buildSectionHeader(context, 'Household'),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Household Name'),
            subtitle: const Text("The Smith Family"),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: Edit household name
            },
          ),
          ListTile(
            leading: const Icon(Icons.people),
            title: const Text('Family Members'),
            subtitle: const Text('4 members'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: Manage family members
            },
          ),
          ListTile(
            leading: const Icon(Icons.share),
            title: const Text('Invite Family Member'),
            subtitle: const Text('Share your household'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: Show invite dialog
            },
          ),

          const Divider(height: 32),

          // Notifications section
          _buildSectionHeader(context, 'Notifications'),
          SwitchListTile(
            secondary: const Icon(Icons.notifications),
            title: const Text('Birthday Reminders'),
            subtitle: const Text('Get notified about upcoming birthdays'),
            value: true,
            onChanged: (value) {
              // TODO: Toggle notifications
            },
          ),
          ListTile(
            leading: const Icon(Icons.schedule),
            title: const Text('Reminder Times'),
            subtitle: const Text('7 days, 1 day, day-of'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: Edit reminder times
            },
          ),
          ListTile(
            leading: const Icon(Icons.access_time),
            title: const Text('Reminder Time of Day'),
            subtitle: const Text('8:00 AM'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: Edit reminder time
            },
          ),

          const Divider(height: 32),

          // Display section
          _buildSectionHeader(context, 'Display'),
          SwitchListTile(
            secondary: const Icon(Icons.star),
            title: const Text('Show Zodiac Signs'),
            value: false,
            onChanged: (value) {
              // TODO: Toggle zodiac signs
            },
          ),
          ListTile(
            leading: const Icon(Icons.palette),
            title: const Text('Theme'),
            subtitle: const Text('System default'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: Show theme selector
            },
          ),

          const Divider(height: 32),

          // Data section
          _buildSectionHeader(context, 'Data'),
          ListTile(
            leading: const Icon(Icons.download),
            title: const Text('Import from Contacts'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: Import contacts
            },
          ),
          ListTile(
            leading: const Icon(Icons.file_download),
            title: const Text('Export to CSV'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: Export data
            },
          ),
          SwitchListTile(
            secondary: const Icon(Icons.calendar_today),
            title: const Text('Sync to Device Calendar'),
            subtitle: const Text('Add birthdays to your calendar app'),
            value: false,
            onChanged: (value) {
              // TODO: Toggle calendar sync
            },
          ),

          const Divider(height: 32),

          // Account section
          _buildSectionHeader(context, 'Account'),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('Account'),
            subtitle: const Text('john@example.com'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: Show account details
            },
          ),
          ListTile(
            leading: const Icon(Icons.sync),
            title: const Text('Sync Status'),
            subtitle: const Text('Last synced: 2 minutes ago'),
            trailing: const Icon(Icons.check_circle, color: Colors.green),
          ),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Sign Out'),
            textColor: Colors.red,
            iconColor: Colors.red,
            onTap: () async {
              final confirmed = await showDialog<bool>(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Sign Out'),
                  content: const Text('Are you sure you want to sign out?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context, false),
                      child: const Text('Cancel'),
                    ),
                    TextButton(
                      onPressed: () => Navigator.pop(context, true),
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.red,
                      ),
                      child: const Text('Sign Out'),
                    ),
                  ],
                ),
              );

              if (confirmed == true) {
                // TODO: Sign out
              }
            },
          ),

          const SizedBox(height: 32),

          // App info
          Center(
            child: Column(
              children: [
                Text(
                  'Birthday Reminder',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 4),
                Text(
                  'Version 1.0.0',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.grey,
                      ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(
        title.toUpperCase(),
        style: Theme.of(context).textTheme.labelSmall?.copyWith(
              color: Theme.of(context).colorScheme.primary,
              fontWeight: FontWeight.bold,
            ),
      ),
    );
  }
}
