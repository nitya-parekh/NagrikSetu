#include <cmath>
#include <iostream>
#include <string>
#include <vector>


using namespace std;

// Data model for an individual civic report
class Complaint {
public:
  string id;
  double latitude;
  double longitude;
  int cluster_id;
  bool visited;

  Complaint(string c_id, double lat, double lon) {
    id = c_id;
    latitude = lat;
    longitude = lon;
    cluster_id = 0;
    visited = false;
  }
};

// Core backend routing and deduplication engine
class SpatialCluster {
private:
  // Calculates the spherical distance between two GPS coordinates in meters
  double calculateHaversineDistance(double lat1, double lon1, double lat2,
                                    double lon2) {
    const double R = 6371000.0; // Earth radius in meters
    const double PI = 3.14159265358979323846;

    double phi1 = lat1 * PI / 180.0;
    double phi2 = lat2 * PI / 180.0;
    double deltaPhi = (lat2 - lat1) * PI / 180.0;
    double deltaLambda = (lon2 - lon1) * PI / 180.0;

    double a =
        sin(deltaPhi / 2.0) * sin(deltaPhi / 2.0) +
        cos(phi1) * cos(phi2) * sin(deltaLambda / 2.0) * sin(deltaLambda / 2.0);
    double c = 2.0 * atan2(sqrt(a), sqrt(1.0 - a));

    return R * c;
  }

  // Finds all complaints within the 50-meter radius of a target complaint
  vector<int> getRegion(int target_index, vector<Complaint> &all_complaints,
                        double eps_meters) {
    vector<int> neighbors;
    for (size_t i = 0; i < all_complaints.size(); i++) {
      double distance = calculateHaversineDistance(
          all_complaints[target_index].latitude,
          all_complaints[target_index].longitude, all_complaints[i].latitude,
          all_complaints[i].longitude);

      // If the distance is within our threshold, flag it as a neighboring
      // duplicate
      if (distance <= eps_meters) {
        neighbors.push_back(i);
      }
    }
    return neighbors;
  }

public:
  // Executes the Density-Based Spatial Clustering algorithm
  void runDBSCAN(vector<Complaint> &complaints) {
    double eps = 50.0; // 50-meter deduplication radius
    int minPts = 1;    // Minimum reports to form a valid cluster
    int current_cluster = 0;

    for (size_t i = 0; i < complaints.size(); i++) {
      if (complaints[i].visited)
        continue;
      complaints[i].visited = true;

      vector<int> neighbors = getRegion(i, complaints, eps);

      // If a cluster is found, group the central point and evaluate its
      // neighbors
      if (neighbors.size() >= minPts) {
        current_cluster++;
        complaints[i].cluster_id = current_cluster;

        for (size_t j = 0; j < neighbors.size(); j++) {
          int neighbor_idx = neighbors[j];

          if (!complaints[neighbor_idx].visited) {
            complaints[neighbor_idx].visited = true;
            vector<int> extended_neighbors =
                getRegion(neighbor_idx, complaints, eps);

            // Expand the cluster if neighbors also have overlapping duplicates
            if (extended_neighbors.size() >= minPts) {
              neighbors.insert(neighbors.end(), extended_neighbors.begin(),
                               extended_neighbors.end());
            }
          }

          // Assign the cluster ID if it hasn't been grouped yet
          if (complaints[neighbor_idx].cluster_id == 0) {
            complaints[neighbor_idx].cluster_id = current_cluster;
          }
        }
      }
    }

    cout << "Clustering algorithm complete." << endl;
    cout << "Total distinct civic issue clusters mapped: " << current_cluster
         << endl;
  }
};

int main() {
  // 1. Create a list of mock citizen reports
  vector<Complaint> reports;

  // Cluster 1: Three potholes reported right next to each other on Linking Road
  reports.push_back(Complaint("CMP-ABC123", 19.06450, 72.83580));
  reports.push_back(Complaint("CMP-ABC124", 19.06452, 72.83582));
  reports.push_back(Complaint("CMP-ABC125", 19.06448, 72.83578));

  // Cluster 2: A totally unrelated issue reported far away
  reports.push_back(Complaint("CMP-XYZ999", 19.05000, 72.82000));

  // 2. Initialize and run your engine
  cout << "Initializing Civic Accountability Engine..." << endl;
  cout << "Processing " << reports.size() << " incoming reports..." << endl;

  SpatialCluster engine;
  engine.runDBSCAN(reports);

  return 0;
}