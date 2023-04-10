import java.util.Arrays;
import java.util.List;

import compass.App;
import compass.http.Session;

import sorters.*;

public class Main {

    /**
     * @param args
     */
    public static void main(String[] args) {

        App<Session> app = new App<Session>(8080);

        app.getDefaultMessage().addHeader("Access-Control-Allow-Origin", "*");

        app.addRoute("/", (req, res, ses) -> {
            System.out.println(req);
            res.setBody("Hello Word!");
        });

        app.addRoute("/quicksort", (req, res, ses) -> {
            int[] arr = generateArray();
            List<int[]> list = QuickSort.sort(arr);
            res.setBody(stringifySnapshots(list));
        });

        app.addRoute("/bubblesort", (req, res, ses) -> {
            int[] arr = generateArray();
            List<int[]> list = BubbleSort.sort(arr);
            res.setBody(stringifySnapshots(list));
        });

        app.addRoute("/selectionsort", (req, res, ses) -> {
            int[] arr = generateArray();
            List<int[]> list = SelectionSort.sort(arr);
            res.setBody(stringifySnapshots(list));
        });

        app.addRoute("/insertionsort", (req, res, ses) -> {
            int[] arr = generateArray();
            List<int[]> list = InsertionSort.sort(arr);
            res.setBody(stringifySnapshots(list));
        });

        app.addRoute("/heapsort", (req, res, ses) -> {
            int[] arr = new int[21];
            arr[0] = 0;
            for (int i = 1; i < arr.length; i++)  // need to specially make array since heapsort works on 1-indexed arrays
                arr[i] = (int) (Math.random() * arr.length * 2);
            List<int[]> list = HeapSort.sort(arr);
            res.setBody(stringifySnapshots(list));
        });

        app.start();
    }

    private static int[] generateArray() {
        int[] arr = new int[20];
        for (int i = 0; i < arr.length; i++)
            arr[i] = (int) (Math.random() * arr.length * 2);
        return arr;
    }

    private static String stringifySnapshots(List<int[]> list) {
        String out = "[";
        for (int[] a : list)
            out += Arrays.toString(a) + ",";
        out = out.substring(0, out.length() - 1);
        out += "]";
        return out;
    }
}