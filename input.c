#include <stdio.h>
#include <stdlib.h>

/* Código que soma dois números */
int main() 
{
  int num1 = 10;
  int num2 = 20;
  int sum = num1 + num2;

  printf("A soma de %d e %d é %d\n", num1, num2, sum);

  if (sum > num2) {
    sum = sum * num2;
    printf("novo valor %d\n",sum);
  } else {
    sum = num1 + num2;
    printf("novo valor %d\n",sum);
  }
  return 0;
}