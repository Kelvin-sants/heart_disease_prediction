import unittest

from main import app


class HealthEndpointTest(unittest.TestCase):
    def test_health_returns_ok(self):
        route = next(route for route in app.routes if route.path == "/health")

        self.assertIn("GET", route.methods)
        self.assertEqual(route.endpoint(), {"status": "ok"})


if __name__ == "__main__":
    unittest.main()
