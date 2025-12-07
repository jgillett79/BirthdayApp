import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Upcoming Birthdays'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              // TODO: Navigate to notifications
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSection(
            context,
            'This Week',
            [
              _buildBirthdayCard(
                context,
                name: 'Mia Thompson',
                age: 9,
                daysUntil: 3,
                anchor: "Emily's friend",
              ),
              _buildBirthdayCard(
                context,
                name: 'Grandma',
                age: 72,
                daysUntil: 5,
                anchor: 'Family',
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildSection(
            context,
            'This Month',
            [
              _buildBirthdayCard(
                context,
                name: 'Jack Wilson',
                age: 7,
                daysUntil: 12,
                anchor: "Jack's friend",
              ),
            ],
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // TODO: Navigate to add person screen
        },
        icon: const Icon(Icons.add),
        label: const Text('Add Birthday'),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 0,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_month),
            label: 'Calendar',
          ),
          NavigationDestination(
            icon: Icon(Icons.people),
            label: 'People',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
        onDestinationSelected: (index) {
          // TODO: Navigate to selected screen
        },
      ),
    );
  }

  Widget _buildSection(BuildContext context, String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 12),
        ...children,
      ],
    );
  }

  Widget _buildBirthdayCard(
    BuildContext context, {
    required String name,
    required int age,
    required int daysUntil,
    required String anchor,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          // TODO: Navigate to person detail
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              CircleAvatar(
                radius: 30,
                child: Text(
                  name[0],
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Turns $age',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      anchor,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Colors.grey[600],
                          ),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: daysUntil <= 3
                          ? Colors.red.shade100
                          : Colors.blue.shade100,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      '$daysUntil days',
                      style: TextStyle(
                        color: daysUntil <= 3 ? Colors.red.shade900 : Colors.blue.shade900,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  if (daysUntil <= 14) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        _buildQuickCheckbox(Icons.card_giftcard, false),
                        const SizedBox(width: 8),
                        _buildQuickCheckbox(Icons.mail, false),
                      ],
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickCheckbox(IconData icon, bool checked) {
    return Icon(
      icon,
      size: 20,
      color: checked ? Colors.green : Colors.grey,
    );
  }
}
