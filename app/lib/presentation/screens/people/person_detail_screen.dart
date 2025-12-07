import 'package:flutter/material.dart';
import '../../../data/models/person.dart';
import '../../../core/utils/date_utils.dart';

class PersonDetailScreen extends StatelessWidget {
  final Person person;

  const PersonDetailScreen({
    super.key,
    required this.person,
  });

  @override
  Widget build(BuildContext context) {
    final age = person.age;
    final daysUntil = person.daysUntilBirthday;

    return Scaffold(
      appBar: AppBar(
        title: Text(person.name),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              // TODO: Navigate to edit screen
            },
          ),
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () async {
              final confirmed = await showDialog<bool>(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Delete Birthday'),
                  content: Text('Are you sure you want to delete ${person.name}?'),
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
                      child: const Text('Delete'),
                    ),
                  ],
                ),
              );

              if (confirmed == true && context.mounted) {
                // TODO: Delete person
                Navigator.pop(context);
              }
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Avatar and name
          Center(
            child: Column(
              children: [
                CircleAvatar(
                  radius: 60,
                  child: Text(
                    person.name[0],
                    style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  person.name,
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                if (age != null)
                  Text(
                    '$age years old',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: Colors.grey[600],
                        ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Birthday info card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Birthday',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 12),
                  _buildInfoRow(
                    context,
                    Icons.cake,
                    'Date',
                    '${person.birthdayMonth}/${person.birthdayDay}${person.birthYear != null ? '/${person.birthYear}' : ''}',
                  ),
                  _buildInfoRow(
                    context,
                    Icons.timer,
                    'In',
                    DateHelper.formatDaysUntil(daysUntil),
                  ),
                  _buildInfoRow(
                    context,
                    Icons.star,
                    'Zodiac',
                    person.zodiacSign,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // This Year section
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'This Year',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 12),
                  CheckboxListTile(
                    title: const Text('Gift Bought'),
                    value: false,
                    onChanged: (value) {
                      // TODO: Update yearly event
                    },
                  ),
                  CheckboxListTile(
                    title: const Text('RSVP Sent'),
                    value: false,
                    onChanged: (value) {
                      // TODO: Update yearly event
                    },
                  ),
                  CheckboxListTile(
                    title: const Text('Card Sent'),
                    value: false,
                    onChanged: (value) {
                      // TODO: Update yearly event
                    },
                  ),
                  const Divider(),
                  ListTile(
                    leading: const Icon(Icons.event),
                    title: const Text('Party Details'),
                    subtitle: const Text('Tap to add party date and location'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // TODO: Show party details dialog
                    },
                  ),
                  ListTile(
                    leading: const Icon(Icons.card_giftcard),
                    title: const Text('Gift Ideas'),
                    subtitle: const Text('Track what to get them'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // TODO: Show gift dialog
                    },
                  ),
                ],
              ),
            ),
          ),

          if (person.notes != null && person.notes!.isNotEmpty) ...[
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Notes',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(person.notes!),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildInfoRow(
    BuildContext context,
    IconData icon,
    String label,
    String value,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Text(
            '$label:',
            style: TextStyle(color: Colors.grey[600]),
          ),
          const SizedBox(width: 8),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}
