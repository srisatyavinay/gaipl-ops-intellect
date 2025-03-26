import json

def load_mock_data(file_path):
    """ Load mock data from a JSON file. """
    with open(file_path, "r") as file:
        return json.load(file)

def run_health_check(data):
    """ Perform health checks on services, resources, and incidents. """
    report = {}

    # **1. Check Service Statuses**
    report["services"] = {
        service: "✅ OK" if details["status"] == "up"
        else "⚠️ Degraded" if details["status"] == "degraded"
        else "❌ Down"
        for service, details in data["services"].items()
    }

    # **2. Detect High Resource Usage**
    report["resource_utilization"] = {
        res: f"⚠️ High Usage ({details['usage']}%)" if details["usage"] > details["threshold"]
        else "✅ Normal"
        for res, details in data["resources"].items()
    }

    # **3. Identify Anomalies (e.g., High Latency)**
    report["anomalies"] = {
        service: f"⚠️ High Latency ({details['latency']}ms)" if details["latency"] and details["latency"] > 250
        else "✅ Normal"
        for service, details in data["services"].items()
    }

    # **4. Root Cause Analysis (Correlating Logs with Incidents)**
    rca_findings = []
    for incident in data["incidents"]:
        related_logs = [log for log in data["logs"] if log["component"] == incident["service"]]
        rca_findings.append({
            "incident": incident["id"],
            "service": incident["service"],
            "root_cause_logs": related_logs if related_logs else "No direct logs found",
            "suggested_action": (
                "Check database query performance" if "Database" in incident["service"]
                else "Investigate API rate limits" if "Payment" in incident["service"]
                else "Perform standard troubleshooting"
            )
        })

    report["rca_findings"] = rca_findings

    return report


# health_data = load_mock_data("health_logs.json")  # Load data from JSON
# health_report = run_health_check(health_data)

# # **Print Results in a Structured Format**
# print(json.dumps(health_report, indent=2))
